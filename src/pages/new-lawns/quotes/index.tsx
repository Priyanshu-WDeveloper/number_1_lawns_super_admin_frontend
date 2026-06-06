import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, MailOpen, Mail } from 'lucide-react';
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
  useGetNLQuotesQuery,
  useDeleteNLQuoteMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import type { QuoteRequest } from '@/types/new-lawns.types';

const QuoteListPage = () => {
  const navigate = useNavigate();
  const [deleteNLQuote] = useDeleteNLQuoteMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
  } = useDataTableState({ defaultLimit: 10 });

  const { data, isLoading } = useGetNLQuotesQuery(
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
      await deleteNLQuote(deleteId).unwrap();
      toast.success('Quote request deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete quote request'));
    }
  };

  const columns: ColumnDef<QuoteRequest>[] = [
    {
      accessorKey: 'isRead',
      header: '',
      cell: (row: QuoteRequest) => (
        <span className="flex items-center justify-center">
          {row.isRead ? (
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Mail className="h-4 w-4 text-blue-500" />
          )}
        </span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      sortable: true,
      cell: (row: QuoteRequest) => (
        <span className="font-medium text-foreground">
          {row.fullName}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row: QuoteRequest) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
    {
      accessorKey: 'serviceRequired',
      header: 'Service',
      cell: (row: QuoteRequest) => (
        <span className="text-muted-foreground">{row.serviceRequired}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row: QuoteRequest) => (
        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
            {row.status}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (row: QuoteRequest) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: QuoteRequest) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            intent="view"
            onClick={() =>
              navigate(
                NEW_LAWNS_ROUTES.QUOTES_VIEW.replace(':id', row._id),
                { state: { quote: row } },
              )
            }
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
              title="Quote Requests"
              subtitle="Manage customer quote requests"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <DataTable<QuoteRequest>
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                title=""
                description=""
                searchPlaceholder="Search by name or email..."
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
        title="Delete Quote Request"
        description="Are you sure you want to delete this quote request? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </SuperAdminLayout>
  );
};

export default QuoteListPage;
