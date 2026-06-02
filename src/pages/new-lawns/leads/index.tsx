import { useState } from 'react';
import { Eye, Phone, Mail, Ellipsis, Trash2 } from 'lucide-react';
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
  useGetNLLeadsQuery,
  useUpdateNLLeadMutation,
  useDeleteNLLeadMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import type {
  NewLawnLead,
  NewLawnListParams,
} from '@/types/new-lawns.types';

const leadStatusConfig: Record<string, { color: string; label: string }> =
  {
    new: { color: '#3b82f6', label: 'New' },
    contacted: { color: '#f59e0b', label: 'Contacted' },
    quoted: { color: '#8b5cf6', label: 'Quoted' },
    won: { color: '#22c55e', label: 'Won' },
    lost: { color: '#ef4444', label: 'Lost' },
  };

const mapSortToApi = (
  sortValue: string,
): NewLawnListParams['sort'] => {
  if (sortValue === 'createdAt' || sortValue === 'createdAt_desc')
    return sortValue;
  return sortValue || undefined;
};

const NewLawnLeadsPage = () => {
  const navigate = useNavigate();
  const [updateLead] = useUpdateNLLeadMutation();
  const [deleteLead] = useDeleteNLLeadMutation();
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

  const { data, isLoading } = useGetNLLeadsQuery(
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
    status: NewLawnLead['status'],
  ) => {
    try {
      await updateLead({ id, status }).unwrap();
      toast.success(`Lead status set to ${status}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLead(deleteId).unwrap();
      toast.success('Lead deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete lead'));
    }
  };

  const columns: ColumnDef<NewLawnLead>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      sortable: true,
      cell: (row: NewLawnLead) => (
        <span className="font-medium text-foreground">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row: NewLawnLead) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: (row: NewLawnLead) => (
        <span className="text-muted-foreground">{row.phone}</span>
      ),
    },
    {
      accessorKey: 'service',
      header: 'Service',
      cell: (row: NewLawnLead) => (
        <span className="text-muted-foreground">{row.service}</span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: (row: NewLawnLead) => (
        <span className="text-muted-foreground">{row.city}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row: NewLawnLead) => (
        <StatusBadge status={row.status} config={leadStatusConfig} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      sortable: true,
      cell: (row: NewLawnLead) => (
        <span className="text-muted-foreground">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: NewLawnLead) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            className="h-8 w-8 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-none"
            onClick={() =>
              navigate(
                NEW_LAWNS_ROUTES.LEADS_VIEW.replace(':id', row._id),
                { state: { lead: row } },
              )
            }
          />
          <ActionButton
            icon={<Phone className="h-3.5 w-3.5" />}
            className="h-8 w-8 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-none"
            onClick={() => toast.success(`Call lead: ${row.phone}`)}
          />
          <ActionButton
            icon={<Mail className="h-3.5 w-3.5" />}
            className="h-8 w-8 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-none"
            onClick={() => toast.success(`Email lead: ${row.email}`)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton
                icon={<Ellipsis className="h-3.5 w-3.5" />}
                className="h-8 w-8 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(
                ['new', 'contacted', 'quoted', 'won', 'lost'] as const
              ).map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={row.status === status}
                  onClick={() => handleStatusChange(row._id, status)}
                  className="truncate"
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        leadStatusConfig[status].color,
                    }}
                  />
                  Mark as {leadStatusConfig[status].label}
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
              title="New Lawns Leads"
              subtitle="Manage incoming lawn care leads"
            />
            <div className="flex-1 min-h-0 mt-4 flex flex-col">
              <DataTable<NewLawnLead>
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                title=""
                description=""
                searchPlaceholder="Search leads by name, email or phone..."
                filterField="status"
                filterOptions={['New', 'Contacted', 'Quoted', 'Won', 'Lost']}
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
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </SuperAdminLayout>
  );
};

export default NewLawnLeadsPage;
