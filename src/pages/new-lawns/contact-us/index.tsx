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
  useGetNLContactsQuery,
  useDeleteNLContactMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import type { ContactInquiry } from '@/types/new-lawns.types';

const ContactUsListPage = () => {
  const navigate = useNavigate();
  const [deleteNLContact] = useDeleteNLContactMutation();
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

  const { data, isLoading } = useGetNLContactsQuery(
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
      await deleteNLContact(deleteId).unwrap();
      toast.success('Contact inquiry deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete inquiry'));
    }
  };

  const columns: ColumnDef<ContactInquiry>[] = [
    {
      accessorKey: 'isRead',
      header: '',
      cell: (row: ContactInquiry) => (
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
      accessorKey: 'name',
      header: 'Name',
      sortable: true,
      cell: (row: ContactInquiry) => (
        <span className="font-medium text-foreground">
          {row.name}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row: ContactInquiry) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: (row: ContactInquiry) => (
        <span className="text-muted-foreground">{row.phone || '-'}</span>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: (row: ContactInquiry) => (
        <span className="text-muted-foreground max-w-[250px] truncate block">
          {row.message}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (row: ContactInquiry) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: ContactInquiry) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            intent="view"
            onClick={() =>
              navigate(
                NEW_LAWNS_ROUTES.CONTACTS_VIEW.replace(':id', row._id),
                { state: { inquiry: row } },
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
              title="Contact Inquiries"
              subtitle="Manage customer inquiries from the website"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <DataTable<ContactInquiry>
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
        title="Delete Inquiry"
        description="Are you sure you want to delete this contact inquiry? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </SuperAdminLayout>
  );
};

export default ContactUsListPage;
