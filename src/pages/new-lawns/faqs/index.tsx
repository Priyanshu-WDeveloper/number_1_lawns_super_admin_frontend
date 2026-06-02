import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import DataTable, { ActionButton, type ColumnDef } from '@/components/data-table/data-table';
import { StatusBadge } from '@/components/data-table/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useGetNLFAQsQuery, useDeleteNLFAQMutation, useUpdateNLFAQMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnFAQ } from '@/types/new-lawns.types';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Active' },
  inactive: { color: '#6b7280', label: 'Inactive' },
};

export default function FAQsListPage() {
  const navigate = useNavigate();
  const { page, setPage, limit, setLimit, search, setSearch, debouncedSearch, statusFilter, setStatusFilter, sort, setSort } = useDataTableState({ defaultLimit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetNLFAQsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
    sort,
  });

  const [deleteFAQ] = useDeleteNLFAQMutation();
  const [updateFAQ] = useUpdateNLFAQMutation();

  const handleToggleStatus = async (faq: NewLawnFAQ) => {
    try {
      await updateFAQ({ id: faq._id, status: faq.status === 'active' ? 'inactive' : 'active' }).unwrap();
      toast.success(`FAQ ${faq.status === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to toggle status'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFAQ(deleteId).unwrap();
      toast.success('FAQ deleted successfully');
      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete FAQ'));
    }
  };

  const columns: ColumnDef<NewLawnFAQ>[] = [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: (row) => (
        <span className="max-w-[300px] truncate block">{row.question}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'order',
      header: 'Order',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} config={STATUS_CONFIG} />,
      filterField: 'status',
      filterOptions: ['Active', 'Inactive'],
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Pencil className="h-4 w-4" />}
            intent="edit"
            onClick={() => navigate(NEW_LAWNS_ROUTES.FAQS_EDIT.replace(':id', row._id), { state: { faq: row } })}
          />
          <ActionButton
            icon={<Trash2 className="h-4 w-4" />}
            intent="delete"
            onClick={() => setDeleteId(row._id)}
          />
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
              <DropdownMenuItem onClick={() => navigate(NEW_LAWNS_ROUTES.FAQS_EDIT.replace(':id', row._id), { state: { faq: row } })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteId(row._id)}>
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
      <Navbar title="New Lawns FAQs" subtitle="Manage frequently asked questions" superAccess />
      <div className="flex-1 px-6 pb-6">
        <DataTable<NewLawnFAQ>
          data={data?.items ?? []}
          columns={columns}
          title="FAQs"
          description="Manage frequently asked questions"
          addButtonLabel="Add FAQ"
          onAddClick={() => navigate(NEW_LAWNS_ROUTES.FAQS_CREATE)}
          searchPlaceholder="Search FAQs..."
          filterField="status"
          filterOptions={['Active', 'Inactive']}
          loading={isLoading}
          serverSideFiltering
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); }}
          filterValue={statusFilter}
          onFilterChange={(v) => { setStatusFilter(v); }}
          sortValue={sort}
          onSortChange={setSort}
          serverSideSorting
          pagination={data ? { page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages } : undefined}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </SuperAdminLayout>
  );
}
