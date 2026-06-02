import { useState } from 'react';
import { Star, Ellipsis, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import DataTable, {
  ActionButton,
  type ColumnDef,
} from '@/components/data-table/data-table';
import { StatusBadge } from '@/components/data-table/status-badge';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  useGetNLReviewsQuery,
  useUpdateNLReviewMutation,
  useDeleteNLReviewMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import type {
  NewLawnReview,
  NewLawnListParams,
} from '@/types/new-lawns.types';

const reviewStatusConfig: Record<
  string,
  { color: string; label: string }
> = {
  approved: { color: '#22c55e', label: 'Approved' },
  pending: { color: '#f59e0b', label: 'Pending' },
  rejected: { color: '#ef4444', label: 'Rejected' },
};

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

const mapSortToApi = (
  sortValue: string,
): NewLawnListParams['sort'] => {
  if (sortValue === 'createdAt' || sortValue === 'createdAt_desc')
    return sortValue;
  return sortValue || undefined;
};

const NewLawnReviewsPage = () => {
  const navigate = useNavigate();
  const [updateReview] = useUpdateNLReviewMutation();
  const [deleteReview] = useDeleteNLReviewMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
  } = useDataTableState({ defaultLimit: 8 });

  const { data, isLoading } = useGetNLReviewsQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter === 'All' ? undefined : statusFilter,
      sort: mapSortToApi(sort),
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleStatusChange = async (
    id: string,
    status: NewLawnReview['status'],
  ) => {
    try {
      await updateReview({ id, status }).unwrap();
      toast.success(`Review set to ${status}`);
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Failed to update review status'),
      );
    }
  };

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

  const columns: ColumnDef<NewLawnReview>[] = [
    {
      accessorKey: 'customerName',
      header: 'Customer',
      sortable: true,
      cell: (row: NewLawnReview) => (
        <span className="font-medium text-foreground">
          {row.customerName}
        </span>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: (row: NewLawnReview) => <StarRating rating={row.rating} />,
    },
    {
      accessorKey: 'service',
      header: 'Service',
      cell: (row: NewLawnReview) => (
        <span className="text-muted-foreground">{row.service}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row: NewLawnReview) => (
        <StatusBadge
          status={row.status}
          config={reviewStatusConfig}
        />
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
      accessorKey: 'text',
      header: 'Review',
      cell: (row: NewLawnReview) => (
        <span className="text-muted-foreground max-w-[200px] truncate block">
          {row.text}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: NewLawnReview) => (
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton
                icon={<Ellipsis className="h-3.5 w-3.5" />}
                className="h-8 w-8 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(
                ['approved', 'pending', 'rejected'] as const
              ).map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={row.status === status}
                  onClick={() =>
                    handleStatusChange(row._id, status)
                  }
                  className="truncate"
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        reviewStatusConfig[status].color,
                    }}
                  />
                  {reviewStatusConfig[status].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 border-t border-border mt-1 pt-1"
                onClick={() => setDeleteId(row._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                searchPlaceholder="Search reviews by customer name..."
                filterField="status"
                filterOptions={['Approved', 'Pending', 'Rejected']}
                addButtonLabel="Add Review"
                onAddClick={() =>
                  navigate(NEW_LAWNS_ROUTES.REVIEWS_CREATE)
                }
                searchValue={search}
                onSearchChange={setSearch}
                filterValue={statusFilter}
                onFilterChange={setStatusFilter}
                sortValue={sort}
                onSortChange={setSort}
                serverSideFiltering
                serverSideSorting
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
    </SuperAdminLayout>
  );
};

export default NewLawnReviewsPage;
