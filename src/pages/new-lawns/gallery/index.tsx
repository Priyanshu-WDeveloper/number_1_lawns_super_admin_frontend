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
import { useGetNLGalleryQuery, useDeleteNLGalleryItemMutation, useUpdateNLGalleryItemMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnGalleryItem } from '@/types/new-lawns.types';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Active' },
  inactive: { color: '#6b7280', label: 'Inactive' },
};

const CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  artificial: { color: '#3b82f6', label: 'Artificial' },
  natural: { color: '#22c55e', label: 'Natural' },
  'before-after': { color: '#8b5cf6', label: 'Before/After' },
  design: { color: '#f59e0b', label: 'Design' },
  other: { color: '#6b7280', label: 'Other' },
};

export default function GalleryListPage() {
  const navigate = useNavigate();
  const { page, setPage, limit, setLimit, search, setSearch, debouncedSearch, statusFilter, setStatusFilter, sort, setSort } = useDataTableState({ defaultLimit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetNLGalleryQuery({
    page, limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    sort,
  });

  const [deleteItem] = useDeleteNLGalleryItemMutation();
  const [updateItem] = useUpdateNLGalleryItemMutation();

  const handleToggleStatus = async (item: NewLawnGalleryItem) => {
    try {
      await updateItem({ id: item._id, status: item.status === 'active' ? 'inactive' : 'active' }).unwrap();
      toast.success(`Gallery item ${item.status === 'active' ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to toggle status'));
    }
  };

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

  const columns: ColumnDef<NewLawnGalleryItem>[] = [
    { accessorKey: 'title', header: 'Title', cell: (row) => <span className="font-medium">{row.title}</span> },
    {
      accessorKey: 'category', header: 'Category',
      cell: (row) => <StatusBadge status={row.category} config={CATEGORY_CONFIG} />,
    },
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
            onClick={() => navigate(NEW_LAWNS_ROUTES.GALLERY_EDIT.replace(':id', row._id), { state: { gallery: row } })} />
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
      <Navbar title="New Lawns Gallery" subtitle="Manage gallery images" superAccess />
      <div className="flex-1 px-6 pb-6">
        <DataTable<NewLawnGalleryItem>
          data={data?.items ?? []} columns={columns}
          title="" description=""
          addButtonLabel="Add Image" onAddClick={() => navigate(NEW_LAWNS_ROUTES.GALLERY_CREATE)}
          searchPlaceholder="Search gallery..."
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
        title="Delete Gallery Item" description="Are you sure? This cannot be undone."
        confirmText="Delete" variant="destructive" onConfirm={handleDelete} />
    </SuperAdminLayout>
  );
}
