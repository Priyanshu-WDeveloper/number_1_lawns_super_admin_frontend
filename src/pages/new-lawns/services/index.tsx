import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { ActionButton } from '@/components/data-table/data-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { getErrorMessage } from '@/lib/get-error-message';
import { IMAGE_PLACEHOLDER } from '@/lib/image-placeholder';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import {
  useGetNLServicesQuery,
  useDeleteNLServiceMutation,
  useCreateNLServiceMutation,
  useUpdateNLServiceMutation,
} from '@/API/new-lawns-api';
import type { NewLawnService } from '@/types/new-lawns.types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ServiceFormFields,
  useServiceForm,
  type ServiceFormData,
} from './components/service-form';

const ServicesListPage = () => {
  const navigate = useNavigate();
  const [deleteNLService] = useDeleteNLServiceMutation();
  const [createNLService] = useCreateNLServiceMutation();
  const [updateNLService] = useUpdateNLServiceMutation();
  const [deleteItem, setDeleteItem] = useState<NewLawnService | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState<NewLawnService | null>(
    null,
  );
  const form = useServiceForm();
  const editForm = useServiceForm();

  const {
    page,
    setPage,
    limit,
    search,
    setSearch,
    debouncedSearch,
    sort,
  } = useDataTableState({ defaultLimit: 9 });

  const { data, isLoading } = useGetNLServicesQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      sort,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteNLService(deleteItem._id).unwrap();
      toast.success('Service deleted successfully');
      setDeleteItem(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete service'));
    }
  };

  const handleCreate = async (data: ServiceFormData) => {
    try {
      await createNLService(data).unwrap();
      toast.success('Service created successfully');
      setShowCreateModal(false);
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create service'));
    }
  };

  const handleEdit = async (data: ServiceFormData) => {
    if (!editItem) return;
    try {
      await updateNLService({ id: editItem._id, ...data }).unwrap();
      toast.success('Service updated successfully');
      setEditItem(null);
      editForm.reset();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update service'));
    }
  };

  useEffect(() => {
    if (editItem) {
      editForm.reset({
        title: editItem.title,
        description: editItem.description,
        image: editItem.image || '',
      });
    }
  }, [editItem]);

  const imgErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = IMAGE_PLACEHOLDER;
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
      <div className="flex items-center justify-end gap-3 pt-4">
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
              superAccess
              title="New Lawns Services"
              subtitle="Manage lawn care services and pricing"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap shrink-0">
                <div className="relative flex-1 max-w-md min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search services by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 sm:pl-10 pr-6 text-xs sm:text-sm rounded-xl border-border bg-background h-10"
                  />
                </div>
                <Button
                  className="h-10 rounded-xl bg-green-600 text-white hover:bg-green-700 px-5"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    Add Service
                  </span>
                </Button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden animate-pulse p-4"
                      >
                        <div className="flex flex-row items-start gap-4">
                          <div className="h-20 w-28 shrink-0 rounded-xl bg-muted" />
                          <div className="flex flex-col min-w-0 flex-1 space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-full" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                            <div className="flex gap-1 pt-3">
                              <div className="h-9 w-9 bg-muted rounded-full" />
                              <div className="h-9 w-9 bg-muted rounded-full" />
                              <div className="h-9 w-9 bg-muted rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data?.items?.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    No services found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.items.map((service) => (
                      <div
                        key={service._id}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden p-4"
                      >
                        <div className="flex flex-row items-start gap-4">
                          <img
                            src={service.image || IMAGE_PLACEHOLDER}
                            alt={service.title}
                            className="h-20 w-28 shrink-0 rounded-xl object-cover"
                            onError={imgErr}
                          />
                          <div className="flex flex-1 min-w-0 flex-col">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {service.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {service.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-1 shrink-0 pt-2">
                              <ActionButton
                                icon={<Eye className="h-3.5 w-3.5" />}
                                intent="view"
                                onClick={() =>
                                  navigate(
                                    NEW_LAWNS_ROUTES.SERVICES_VIEW.replace(
                                      ':id',
                                      service._id,
                                    ),
                                    { state: { service } },
                                  )
                                }
                              />
                              <ActionButton
                                icon={
                                  <Pencil className="h-3.5 w-3.5" />
                                }
                                intent="edit"
                                onClick={() => setEditItem(service)}
                              />
                              <ActionButton
                                icon={
                                  <Trash2 className="h-3.5 w-3.5" />
                                }
                                intent="delete"
                                onClick={() => setDeleteItem(service)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0">{renderPagination()}</div>
            </div>
          </div>
        </div>
      </div>
      {deleteItem && (
        <ConfirmDialog
          open={!!deleteItem}
          onOpenChange={(open) => {
            if (!open) setDeleteItem(null);
          }}
          title="Delete Service"
          description={`Are you sure you want to delete "${deleteItem.title}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      )}
      <Dialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <ServiceFormFields form={form} />
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
                  : 'Create Service'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => {
          if (!open) {
            setEditItem(null);
            editForm.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleEdit)}
            className="space-y-5"
          >
            <ServiceFormFields form={editForm} />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditItem(null);
                  editForm.reset();
                }}
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editForm.formState.isSubmitting}
                className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-700 px-6"
              >
                {editForm.formState.isSubmitting
                  ? 'Updating...'
                  : 'Update Service'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
};

export default ServicesListPage;
