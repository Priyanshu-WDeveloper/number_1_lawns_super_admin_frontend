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
import { useGetNLTeamMembersQuery, useDeleteNLTeamMemberMutation, useUpdateNLTeamMemberMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnTeamMember } from '@/types/new-lawns.types';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Active' },
  inactive: { color: '#6b7280', label: 'Inactive' },
};

export default function TeamListPage() {
  const navigate = useNavigate();
  const { page, setPage, limit, setLimit, search, setSearch, debouncedSearch, statusFilter, setStatusFilter, sort, setSort } = useDataTableState({ defaultLimit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetNLTeamMembersQuery({
    page, limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    sort,
  });

  const [deleteItem] = useDeleteNLTeamMemberMutation();
  const [updateItem] = useUpdateNLTeamMemberMutation();

  const handleToggleStatus = async (item: NewLawnTeamMember) => {
    try {
      await updateItem({ id: item._id, status: item.status === 'active' ? 'inactive' : 'active' }).unwrap();
      toast.success(`Team member ${item.status === 'active' ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to toggle status'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId).unwrap();
      toast.success('Team member deleted');
      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete'));
    }
  };

  const columns: ColumnDef<NewLawnTeamMember>[] = [
    {
      accessorKey: 'name', header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.image && <img src={row.image} alt={row.name} className="h-8 w-8 rounded-full object-cover" />}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'status', header: 'Status',
      cell: (row) => <StatusBadge status={row.status} config={STATUS_CONFIG} />,
    },
    {
      accessorKey: 'createdAt', header: 'Created',
      cell: (row) => <span className="text-muted-foreground text-sm">{format(new Date(row.createdAt), 'MMM d, yyyy')}</span>,
    },
    {
      accessorKey: 'actions', header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <ActionButton icon={<Pencil className="h-4 w-4" />} intent="edit"
            onClick={() => navigate(NEW_LAWNS_ROUTES.TEAM_EDIT.replace(':id', row._id), { state: { team: row } })} />
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
      <Navbar title="New Lawns Team" subtitle="Manage team members" superAccess />
      <div className="flex-1 px-6 pb-6">
        <DataTable<NewLawnTeamMember>
          data={data?.items ?? []} columns={columns}
          title="" description=""
          addButtonLabel="Add Member" onAddClick={() => navigate(NEW_LAWNS_ROUTES.TEAM_CREATE)}
          searchPlaceholder="Search team members..."
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
        title="Delete Team Member" description="Are you sure? This cannot be undone."
        confirmText="Delete" variant="destructive" onConfirm={handleDelete} />
    </SuperAdminLayout>
  );
}
