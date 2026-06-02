import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
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
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import {
  useGetNLServicesQuery,
  useDeleteNLServiceMutation,
} from '@/API/new-lawns-api';
import type { NewLawnService } from '@/types/new-lawns.types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Active' },
  inactive: { color: '#ef4444', label: 'Inactive' },
};

const categoryConfig: Record<string, { color: string; label: string }> = {
  installation: { color: '#3b82f6', label: 'Installation' },
  maintenance: { color: '#f59e0b', label: 'Maintenance' },
  design: { color: '#8b5cf6', label: 'Design' },
};

const ServicesListPage = () => {
  const navigate = useNavigate();
  const [deleteNLService] = useDeleteNLServiceMutation();
  const [deleteItem, setDeleteItem] = useState<NewLawnService | null>(null);

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

  const { data, isLoading } = useGetNLServicesQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter === 'All' ? undefined : statusFilter,
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

  const columns: ColumnDef<NewLawnService>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (row: NewLawnService) => (
        <span className="font-medium text-foreground">{row.title}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (row: NewLawnService) => (
        <StatusBadge status={row.category} config={categoryConfig} />
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (row: NewLawnService) => (
        <span className="text-muted-foreground">{row.price}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row: NewLawnService) => (
        <StatusBadge status={row.status} config={statusConfig} />
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: NewLawnService) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            intent="view"
            onClick={() =>
              navigate(
                NEW_LAWNS_ROUTES.SERVICES_VIEW.replace(
                  ':id',
                  row._id,
                ),
                { state: { service: row } },
              )
            }
          />
          <ActionButton
            icon={<Pencil className="h-3.5 w-3.5" />}
            intent="edit"
            onClick={() =>
              navigate(
                NEW_LAWNS_ROUTES.SERVICES_EDIT.replace(
                  ':id',
                  row._id,
                ),
              )
            }
          />
          <ActionButton
            icon={<Trash2 className="h-3.5 w-3.5" />}
            intent="delete"
            onClick={() => setDeleteItem(row)}
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
              title="New Lawns Services"
              subtitle="Manage lawn care services and pricing"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <DataTable<NewLawnService>
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                title=""
                description=""
                searchPlaceholder="Search services by title..."
                filterField="status"
                filterOptions={['Active', 'Inactive']}
                addButtonLabel="Add Service"
                onAddClick={() =>
                  navigate(NEW_LAWNS_ROUTES.SERVICES_CREATE)
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
    </SuperAdminLayout>
  );
};

export default ServicesListPage;
