import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { Navbar } from '@/components/layout/Navbar';
import { Eye, Pencil, Ellipsis } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable, {
  ActionButton,
  type ColumnDef,
} from '../../../components/data-table/DataTable';
import type { IAdmins } from '../../../types/admins.types';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { ROUTES } from '@/constants';
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
} from '../../../API/api';

const SuperAdminAdminsPage: React.FC = () => {
  const navigate = useNavigate();
  const [updateAdminUser] = useUpdateAdminUserMutation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const { data, isLoading } = useGetAdminUsersQuery({ page, limit });
  console.log(
    '\n===================== 🟢 data =====================',
  );
  console.log(data);
  console.log('=================================================\n');
  const statusConfig: Record<
    string,
    { color: string; label: string }
  > = {
    active: { color: '#22c55e', label: 'Active' },
    inactive: { color: '#ef4444', label: 'Inactive' },
    expired: { color: '#f59e0b', label: 'Expired' },
  };

  const adminsColumns: ColumnDef<IAdmins>[] = [
    {
      accessorKey: 'adminId',
      header: 'Admin ID',
      cell: (row: IAdmins) => (
        <span className="text-[#6b7280]">{row.adminId}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: (row: IAdmins) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
            style={
              row.fullName
                ? {
                    backgroundColor: `hsl(${(row.fullName.charCodeAt(0) * 137.5) % 360}, 60%, 90%)`,
                    color: `hsl(${(row.fullName.charCodeAt(0) * 137.5) % 360}, 60%, 35%)`,
                  }
                : { backgroundColor: '#edf8e7', color: '#16610E' }
            }
          >
            {row.fullName
              ? row.fullName.charAt(0).toUpperCase()
              : 'A'}
          </div>
          <div>
            <span className="font-medium text-[#151515]">
              {row.fullName || '-'}
            </span>
            <p className="text-xs text-[#6b7280]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row: IAdmins) => {
        const cfg = statusConfig[row.status] || statusConfig.active;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            <span style={{ color: cfg.color }}>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone',
      cell: (row: IAdmins) => (
        <span className="text-[#6b7280]">
          {row.countryCode} {row.phoneNumber}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: (row: IAdmins) => (
        <span className="text-[#6b7280]">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: (row: IAdmins) => (
        <span className="text-[#6b7280]">
          {new Date(row.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: IAdmins) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={<Eye className="h-3.5 w-3.5" />}
            className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
            onClick={() =>
              navigate(
                ROUTES.ADMIN_VIEW.replace(':id', String(row._id)),
                { state: { admin: row } },
              )
            }
          />
          <ActionButton
            icon={<Pencil className="h-3.5 w-3.5" />}
            className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
            onClick={() =>
              navigate(
                ROUTES.ADMIN_EDIT.replace(':id', String(row._id)),
                { state: { admin: row } },
              )
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ActionButton
                icon={<Ellipsis className="h-3.5 w-3.5" />}
                className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast.success('Login as Admin — frontend only');
                }}
              >
                Login as Admin
              </DropdownMenuItem>
              {row.status === 'active' ? (
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={async () => {
                    try {
                      await updateAdminUser({
                        id: row._id,
                        status: 'inactive',
                      }).unwrap();
                    } catch {
                      toast.error('Failed to update status');
                    }
                  }}
                >
                  Set Inactive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600"
                  onClick={async () => {
                    try {
                      await updateAdminUser({
                        id: row._id,
                        status: 'active',
                      }).unwrap();
                    } catch {
                      toast.error('Failed to update status');
                    }
                  }}
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
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full px-4 py-4 min-h-0">
          <div className="flex w-full flex-col h-full">
            <Navbar
              title="Admin Users"
              subtitle="Manage admin accounts and permissions"
              superAccess
            />
            <div className="flex-1 min-h-0 mt-4">
              <DataTable<IAdmins>
                data={data?.admins || []}
                columns={adminsColumns}
                loading={isLoading}
                title=""
                description=""
                searchPlaceholder="Search admins by name, email or ID..."
                filterField="status"
                filterOptions={['Active', 'Inactive', 'Expired']}
                addButtonLabel="Add admin"
                onAddClick={() => navigate(ROUTES.ADMIN_CREATE)}
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
    </SuperAdminLayout>
  );
};

export default SuperAdminAdminsPage;
