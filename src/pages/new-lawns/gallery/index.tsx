import { useState } from 'react';
import {
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { ActionButton } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  useGetNLGalleryQuery,
  useDeleteNLGalleryItemMutation,
  useCreateNLGalleryItemMutation,
} from '@/API/new-lawns-api';
import { getErrorMessage } from '@/lib/get-error-message';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { NewLawnGalleryItem } from '@/types/new-lawns.types';
import { format } from 'date-fns';
import {
  GalleryFormFields,
  useGalleryForm,
  type GalleryFormData,
} from './components/gallery-form';

export default function GalleryListPage() {
  const { page, setPage, limit, sort } = useDataTableState({
    defaultLimit: 9,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewItem, setViewItem] = useState<NewLawnGalleryItem | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState('All');
  const form = useGalleryForm();

  const { data, isLoading } = useGetNLGalleryQuery({
    page,
    limit,
    sort,
  });

  const [deleteItem] = useDeleteNLGalleryItemMutation();
  const [createItem] = useCreateNLGalleryItemMutation();

  const categories = [
    'All',
    ...new Set(data?.items?.map((i) => i.category) || []),
  ];

  const filteredItems =
    activeCategory === 'All'
      ? (data?.items ?? [])
      : (data?.items ?? []).filter(
          (i) => i.category === activeCategory,
        );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId).unwrap();
      toast.success('Gallery item deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete'));
    }
  };

  const handleCreate = async (data: GalleryFormData) => {
    try {
      const payload = data.isBeforeAfter
        ? {
            category: data.category,
            isBeforeAfter: true,
            beforeImage: data.beforeImage,
            afterImage: data.afterImage,
          }
        : {
            category: data.category,
            isBeforeAfter: false,
            image: data.image,
          };
      await createItem(payload as any).unwrap();
      toast.success('Gallery image created');
      setShowCreateModal(false);
      form.reset();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create'));
    }
  };

  const pagination = data
    ? {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      }
    : null;

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const { page: cur, totalPages, total } = pagination;
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= cur - 1 && i <= cur + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return (
      <div className="flex items-center justify-end gap-3 pt-4 shrink-0">
        <p className="text-[13px] text-muted-foreground whitespace-nowrap">
          {total} results
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-border text-muted-foreground"
            disabled={cur === 1}
            onClick={() => setPage(cur - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`e-${i}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={p === cur ? 'default' : 'outline'}
                size="icon"
                className={`h-8 w-8 rounded-lg text-xs ${p === cur ? 'bg-green-600 text-white hover:bg-green-700' : 'border-border text-muted-foreground'}`}
                onClick={() => setPage(p as number)}
              >
                {p}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-border text-muted-foreground"
            disabled={cur === totalPages}
            onClick={() => setPage(cur + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <SuperAdminLayout>
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex-1 w-full px-2 sm:px-5 py-1 sm:py-4 min-h-0 flex flex-col">
          <div className="flex w-full flex-col flex-1 min-h-0">
            <Navbar
              title="New Lawns Gallery"
              subtitle="Manage gallery images"
              superAccess
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap shrink-0">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition ${
                        activeCategory === cat
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-muted-foreground border-border hover:border-green-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <Button
                  className="h-10 rounded-xl bg-green-600 text-white hover:bg-green-700 px-5 shrink-0"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Image</span>
                </Button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden animate-pulse"
                      >
                        <div className="h-44 bg-muted" />
                        <div className="p-4 flex items-center justify-between gap-2">
                          <div className="h-4 bg-muted rounded w-16" />
                          <div className="flex gap-1">
                            <div className="h-9 w-9 bg-muted rounded-full" />
                            <div className="h-9 w-9 bg-muted rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    No images found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden"
                      >
                        {item.isBeforeAfter ? (
                          <div className="grid grid-cols-2 h-44">
                            <div className="relative">
                              <ImageWithFallback
                                src={item.beforeImage || ''}
                                alt="before"
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute top-1 left-1 text-[10px] bg-black/70 text-white px-1 rounded">
                                B
                              </span>
                            </div>
                            <div className="relative">
                              <ImageWithFallback
                                src={item.afterImage || ''}
                                alt="after"
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute top-1 left-1 text-[10px] bg-black/70 text-white px-1 rounded">
                                A
                              </span>
                            </div>
                          </div>
                        ) : (
                          <ImageWithFallback
                            src={item.image}
                            alt={item.category}
                            className="h-44 w-full object-cover"
                          />
                        )}
                        <div className="p-4 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium truncate">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <ActionButton
                              icon={<Eye className="h-3.5 w-3.5" />}
                              intent="view"
                              onClick={() => setViewItem(item)}
                            />
                            <ActionButton
                              icon={
                                <Trash2 className="h-3.5 w-3.5" />
                              }
                              intent="delete"
                              onClick={() => setDeleteId(item._id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {renderPagination()}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
        title="Delete Gallery Item"
        description="Are you sure? This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <Dialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <GalleryFormFields form={form} />
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
                {form.formState.isSubmitting
                  ? 'Creating...'
                  : 'Create Image'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!viewItem}
        onOpenChange={(o) => {
          if (!o) setViewItem(null);
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gallery Image</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-5">
              {viewItem.isBeforeAfter ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Before
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <ImageWithFallback
                        src={viewItem.beforeImage || viewItem.image}
                        alt="before"
                        className="w-full max-h-64 object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      After
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <ImageWithFallback
                        src={viewItem.afterImage || ''}
                        alt="after"
                        className="w-full max-h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-border">
                  <ImageWithFallback
                    src={viewItem.image}
                    alt={viewItem.category}
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Category
                  </p>
                  <p className="font-medium text-foreground">
                    {viewItem.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Before/After
                  </p>
                  <p
                    className={`font-medium ${viewItem.isBeforeAfter ? 'text-green-600' : 'text-muted-foreground'}`}
                  >
                    {viewItem.isBeforeAfter ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created
                  </p>
                  <p className="font-medium text-foreground">
                    {format(
                      new Date(viewItem.createdAt),
                      'MMM d, yyyy h:mm a',
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Updated
                  </p>
                  <p className="font-medium text-foreground">
                    {format(
                      new Date(viewItem.updatedAt),
                      'MMM d, yyyy h:mm a',
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
