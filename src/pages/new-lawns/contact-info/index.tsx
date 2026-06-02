import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import DataTable, { ActionButton, type ColumnDef } from '@/components/data-table/data-table';
import { StatusBadge } from '@/components/data-table/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useGetNLContactInfoQuery, useDeleteNLContactInfoMutation, useUpdateNLContactInfoMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnContactInfo } from '@/types/new-lawns.types';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Active' },
  inactive: { color: '#6b7280', label: 'Inactive' },
};

const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  phone: { color: '#3b82f6', label: 'Phone' },
  email: { color: '#f59e0b', label: 'Email' },
  address: { color: '#8b5cf6', label: 'Address' },
  social: { color: '#ec4899', label: 'Social' },
  hours: { color: '#14b8a6', label: 'Hours' },
};

export default function ContactInfoListPage() {
  const navigate = useNavigate();
  const { page, setPage, limit, setLimit, search, setSearch, debouncedSearch, statusFilter, setStatusFilter, sort, setSort } = useDataTableState({ defaultLimit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetNLContactInfoQuery({
    page, limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    sort,
  });

  const [deleteItem] = useDeleteNLContactInfoMutation();
  const [updateItem] = useUpdateNLContactInfoMutation();

  const handleToggleStatus = async (item: NewLawnContactInfo) => {
    try {
      await updateItem({ id: item._id, status: item.status === 'active' ? 'inactive' : 'active' }).unwrap();
      toast.success(`Contact ${item.status === 'active' ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to toggle status'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId).unwrap();
      toast.success('Contact info deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete'));
    }
  };

  const columns: ColumnDef<NewLawnContactInfo>[] = [
    {
      accessorKey: 'type', header: 'Type',
      cell: (row) => <StatusBadge status={row.type} config={TYPE_CONFIG} />,
    },
    { accessorKey: 'label', header: 'Label', cell: (row) => <span className="font-medium">{row.label}</span> },
    { accessorKey: 'value', header: 'Value', cell: (row) => <span className="text-muted-foreground">{row.value}</span> },
    { accessorKey: 'order', header: 'Order' },
    {
      accessorKey: 'status', header: 'Status',
      cell: (row) => <StatusBadge status={row.status} config={STATUS_CONFIG} />,
    },
    {
      accessorKey: 'actions', header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <ActionButton icon={<Pencil className="h-4 w-4" />} intent="edit"
            onClick={() => navigate(NEW_LAWNS_ROUTES.CONTACT_INFO_EDIT.replace(':id', row._id), { state: { contact: row } })} />
          <ActionButton icon={<Trash2 className="h-4 w-4" />} intent="delete" onClick={() => setDeleteId(row._id)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm" className="h-9 w-9 rounded-full border-border">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleToggleStatus(row)}>
                {row.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(row._id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <SuperAdminLayout>
      <Navbar title="New Lawns Contact Info" subtitle="Manage contact information" superAccess />
      <div className="flex-1 px-6 pb-6">
        <DataTable<NewLawnContactInfo>
          data={data?.items ?? []} columns={columns}
          title="" description=""
          addButtonLabel="Add Contact" onAddClick={() => navigate(NEW_LAWNS_ROUTES.CONTACT_INFO_CREATE)}
          searchPlaceholder="Search contacts..."
          filterField="status" filterOptions={['Active', 'Inactive']}
          loading={isLoading} serverSideFiltering
          searchValue={search} onSearchChange={setSearch}
          filterValue={statusFilter} onFilterChange={setStatusFilter}
          sortValue={sort} onSortChange={setSort} serverSideSorting
          pagination={data ? { page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages } : undefined}
          onPageChange={setPage} onLimitChange={setLimit}
        />
      </div>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}
        title="Delete Contact" description="Are you sure? This cannot be undone."
        confirmText="Delete" variant="destructive" onConfirm={handleDelete} />
    </SuperAdminLayout>
  );
}
