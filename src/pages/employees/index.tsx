'use client';

// Removed unused imports: React, Button, Card, Input, Select
// import * as React from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Bell,
  ChevronDown,
  Eye, // Imported directly here as it's used in the cell renderer
  Pencil, // Imported directly here as it's used in the cell renderer
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added import for Avatar components

// Corrected import for DataTable and its types
// Using type-only import for ColumnDef due to verbatimModuleSyntax
import type { ColumnDef } from '@/components/data-table/DataTable';
// Removed DataTableData from import as it's unused
import DataTable, {
  ActionButton,
} from '@/components/data-table/DataTable'; // ActionButton is now imported directly from DataTable
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the structure for Employee data
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
}

// Sample Employee Data
const employees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Aman Sharma',
    email: 'aman.sharma@example.com',
    phone: '0211111111',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: 'EMP-002',
    name: 'Babu Kondepudi',
    email: 'babu_kondepudi@yahoo.co.nz',
    phone: '0211470500',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
  },
  {
    id: 'EMP-003',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0227654321',
    role: 'UX Designer',
    department: 'Design',
    status: 'Inactive',
  },
  {
    id: 'EMP-004',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '0219988776',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: 'EMP-004',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '0219988776',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
  },
];

// Define columns for the Employee DataTable
const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: 'Employee ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterField: 'status',
    filterOptions: ['Active', 'Inactive'],
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (row: Employee) => (
      <div className="flex flex-wrap gap-2">
        <ActionButton
          icon={<Eye className="h-4 w-4" />}
          onClick={() => console.log('View employee:', row.id)}
        />
        <ActionButton
          icon={<Pencil className="h-4 w-4" />}
          onClick={() => console.log('Edit employee:', row.id)}
        />
      </div>
    ),
  },
];

// Main Employee Management Page Component
export default function EmployeeManagementPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* <main className="flex-1 w-full overflow-y-auto px-4 pt-9 pb-9"> */}
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="min-h-full w-full">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#151515]">
                Employee Management
              </h2>
              <p className="mt-1 text-[13px] text-[#777]">
                Manage your employees and view their details.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e5] bg-white">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-[#ececec] bg-white px-3 py-1.5 shadow-sm">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold">Admin</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => navigate('/employees/create')}
              className="rounded-xl gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>

          <DataTable<Employee>
            data={employees}
            columns={employeeColumns}
            title="Employees"
            description="Manage all your employees in one place."
            searchPlaceholder="Search employees..."
            filterField="status"
            filterOptions={['Active', 'Inactive']}
          />
        </div>
      </main>
    </AppLayout>
  );
}
