import { useState } from 'react';
import { Eye, Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import DataTable, {
  ActionButton,
  type ColumnDef,
} from '@/components/data-table/data-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { getErrorMessage } from '@/lib/get-error-message';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  useGetNLReviewsQuery,
  useDeleteNLReviewMutation,
  useCreateNLReviewMutation,
} from '@/API/new-lawns-api';
import type { NewLawnReview } from '@/types/new-lawns.types';
import {
  ReviewFormFields,
  useReviewForm,
  type ReviewFormData,
} from './components/review-form';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating
            ? 'text-amber-400 fill-amber-400'
            : 'text-muted-foreground'
        }`}
      />
    ))}
  </div>
);

const NewLawnReviewsPage = () => {
  const [deleteReview] = useDeleteNLReviewMutation();
  const [createReview] = useCreateNLReviewMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewItem, setViewItem] = useState<NewLawnReview | null>(null);
  const form = useReviewForm();

  const {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    debouncedSearch,
    sort,
    setSort,
  } = useDataTableState({ defaultLimit: 8 });

  const { data, isLoading } = useGetNLReviewsQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      sort,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId).unwrap();
      toast.success('Review deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete review'));
    }
  };

  const handleCreate = async (data: ReviewFormData) => {
    try {
      await createReview(data).unwrap();
      toast.success('Review created successfully');
      setShowCreateModal(false);
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create review'));
    }
  };

  const columns: ColumnDef<NewLawnReview>[] = [
    {
      accessorKey: 'reviewerName',
      header: 'Reviewer',
      sortable: true,
      cell: (row: NewLawnReview) => (
        <span className="font-medium text-foreground">
          {row.reviewerName}
        </span>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: (row: NewLawnReview) => (
        <span className="text-muted-foreground">{row.location}</span>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: (row: NewLawnReview) => <StarRating rating={row.rating} />,
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: (row: NewLawnReview) => (
        <span className="text-muted-foreground max-w-[250px] truncate block">
          {row.comment}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      sortable: true,
      cell: (row: NewLawnReview) => (
        <span className="text-muted-foreground">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: NewLawnReview) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            intent="view"
            onClick={() => setViewItem(row)}
          />
          <ActionButton
            icon={<Trash2 className="h-3.5 w-3.5" />}
            intent="delete"
            onClick={() => setDeleteId(row._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 w-full px-2 sm:px-5 py-1 sm:py-4 min-h-0 flex flex-col">
          <div className="flex w-full flex-col flex-1">
            <Navbar
              superAccess
              title="New Lawns Reviews"
              subtitle="Manage customer reviews"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <DataTable<NewLawnReview>
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                title=""
                description=""
                searchPlaceholder="Search reviews by reviewer name..."
                addButtonLabel="Add Review"
                onAddClick={() => setShowCreateModal(true)}
                searchValue={search}
                onSearchChange={setSearch}
                serverSideFiltering
                serverSideSorting
                sortValue={sort}
                onSortChange={setSort}
                pagination={
                  data
                    ? {
                        page: data.page,
                        limit: data.limit,
                        total: data.total,
                        totalPages: data.totalPages,
                      }
                    : undefined
                }
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-5">
            <ReviewFormFields form={form} />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  form.reset();
                }}
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-700 px-6"
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewItem} onOpenChange={(o) => { if (!o) setViewItem(null); }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-semibold text-foreground">{viewItem.reviewerName}</p>
                <p className="text-muted-foreground">{viewItem.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={viewItem.rating} />
                <span className="text-sm text-muted-foreground">({viewItem.rating}/5)</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Comment</p>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{viewItem.comment}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{format(new Date(viewItem.createdAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="font-medium text-foreground">{format(new Date(viewItem.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
};

export default NewLawnReviewsPage;
