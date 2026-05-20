import { Ellipsis, Eye, Pencil } from 'lucide-react';

import type { ColumnDef } from '@/components/data-table/DataTable';
import DataTable, {
  ActionButton,
} from '@/components/data-table/DataTable';
import { AppLayout } from '@/components/layout/AppLayout';
import { Navbar } from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  useGetCustomersQuery,
  useToggleCustomerStatusMutation,
} from '../../API/api';
import { useMemo } from 'react';
import { useDataTableState } from '../../hooks/useDataTableState';
import type { GetCustomersParams } from '../../types/api.types';
import type { ICustomer } from '../../types';
import { Skeleton } from '../../components/ui/skeleton';
import { StatusBadge } from '../../components/data-table/StatusBadge';
import { AvatarCell } from '../../components/data-table/AvatarCell';
import { formatDate } from '../../lib/format-date';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { color: string; label: string }> =
  {
    active: { color: '#22c55e', label: 'Active' },
    inactive: { color: '#ef4444', label: 'Inactive' },
    expired: { color: '#f59e0b', label: 'Expired' },
  };

const mapSortToApi = (
  sortValue: string,
): GetCustomersParams['sort'] => {
  if (
    sortValue === 'fullName' ||
    sortValue === 'email' ||
    sortValue === 'phoneNumber'
  )
    return 'a_z';
  if (
    sortValue === 'fullName_desc' ||
    sortValue === 'email_desc' ||
    sortValue === 'phoneNumber_desc'
  )
    return 'z_a';
  if (sortValue === 'createdAt' || sortValue === 'updatedAt')
    return 'newest';
  if (
    sortValue === 'createdAt_desc' ||
    sortValue === 'updatedAt_desc'
  )
    return 'oldest';
  return 'newest';
};

export default function CustomerManagementPage() {
  const navigate = useNavigate();
  const [toggleCustomerStatus] = useToggleCustomerStatusMutation();

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
  } = useDataTableState({ defaultLimit: 10 });

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status:
        statusFilter === 'All'
          ? undefined
          : (statusFilter.toLowerCase() as
              | 'active'
              | 'inactive'
              | 'expired'),
      sort: mapSortToApi(sort),
    }),
    [page, limit, debouncedSearch, statusFilter, sort],
  );

  const { data, isLoading } = useGetCustomersQuery(queryParams);
  console.log(
    '\n===================== 🟢 data =====================',
  );
  console.log(data?.customers);
  console.log('=================================================\n');
  const handleStatusChange = async (
    id: string,
    status: 'active' | 'inactive',
  ) => {
    try {
      await toggleCustomerStatus({ id, status }).unwrap();
      toast.success(`Customer set to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const customerColumns: ColumnDef<ICustomer>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      sortable: true,
      skeleton: () => (
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ),
      cell: (row: ICustomer) => (
        <AvatarCell name={row.fullName} email={row.email} />
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone',
      sortable: true,
      skeleton: () => <Skeleton className="h-4 w-24" />,
      cell: (row: ICustomer) => (
        <span className="text-[#6b7280]">
          {row.countryCode} {row.phoneNumber}
        </span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      sortable: true,
      skeleton: () => <Skeleton className="h-4 w-20" />,
      cell: (row: ICustomer) => (
        <span className="text-[#6b7280]">{row.city || '-'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      skeleton: () => (
        <div className="inline-flex items-center gap-1.5">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      ),
      cell: (row: ICustomer) => (
        <StatusBadge status={row.status} config={statusConfig} />
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      skeleton: () => <Skeleton className="h-4 w-16" />,
      cell: (row: ICustomer) => (
        <span
          className={
            row.balance < 0 ? 'text-red-500' : 'text-green-600'
          }
        >
          ${row.balance.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      sortable: true,
      skeleton: () => <Skeleton className="h-4 w-24" />,
      cell: (row: ICustomer) => (
        <span className="text-[#6b7280]">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      skeleton: () => (
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ),
      cell: (row: ICustomer) => (
        <div className="flex items-center gap-1">
          <ActionButton
            intent="view"
            icon={<Eye className="h-4 w-4" />}
            onClick={() =>
              navigate(ROUTES.CUSTOMERS_VIEW.replace(':id', row._id))
            }
          />
          <ActionButton
            intent="edit"
            icon={<Pencil className="h-4 w-4" />}
            onClick={() =>
              navigate(ROUTES.CUSTOMERS_EDIT.replace(':id', row._id))
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton
                icon={<Ellipsis className="h-3.5 w-3.5" />}
                className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.status === 'active' ? (
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() =>
                    handleStatusChange(row._id, 'inactive')
                  }
                >
                  Set Inactive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600"
                  onClick={() =>
                    handleStatusChange(row._id, 'active')
                  }
                >
                  Set Active
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto px-4 py-5">
          <div className="flex w-full flex-col">
            <Navbar
              title="Customer Management"
              subtitle="Manage your customers and view their details."
              showWelcome={false}
            />

            <DataTable<ICustomer>
              data={data?.customers ?? []}
              columns={customerColumns}
              loading={isLoading}
              title=""
              description=""
              searchPlaceholder="Search customers by name, email or phone..."
              filterField="status"
              filterOptions={['Active', 'Inactive', 'Expired']}
              addButtonLabel="Add Customer"
              onAddClick={() => navigate(ROUTES.CUSTOMERS_CREATE)}
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
    </AppLayout>
  );
}
