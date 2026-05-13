'use client';

import {
  Bell,
  ChevronDown,
  Eye,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import type { ColumnDef } from '@/components/data-table/DataTable';
import DataTable, {
  ActionButton,
} from '@/components/data-table/DataTable';
import { AppLayout } from '@/components/layout/AppLayout';

// Define the structure for Invoice data
interface Invoice {
  id: string;
  jobId: string;
  franchise: string;
  customer: string;
  address?: string;
  paymentType: string;
  totalAmount: number;
  receivedAmount: number;
  invoiceDate: string;
  paymentStatus: 'PAID' | 'OVERDUE' | 'PENDING';
  jobType?: string;
  particulars?: string;
  assignedTo?: string;
}

// Sample Invoice Data
const Invoices: Invoice[] = [
  {
    id: '41321',
    jobId: '43029',
    franchise: 'Lawn Masters Aman',
    customer: 'Jason',
    paymentType: 'Bank Transfer',
    totalAmount: 60.0,
    receivedAmount: 60.0,
    invoiceDate: '05/05/2026',
    paymentStatus: 'PAID',
    jobType: 'One Time',
    particulars: 'Garden cleanup: 60.00',
    assignedTo: 'Aman',
  },
  {
    id: '41320',
    jobId: '43028',
    franchise: 'Lawn Masters Aman',
    customer: 'John',
    paymentType: 'Bank Transfer',
    totalAmount: 50.0,
    receivedAmount: 0,
    invoiceDate: '26/03/2026',
    paymentStatus: 'OVERDUE',
    jobType: 'Recurring',
    particulars: 'Lawn mowing: 50.00',
    assignedTo: 'Aman',
  },
  {
    id: '41319',
    jobId: '43027',
    franchise: 'Green Yard Services',
    customer: 'Michael',
    paymentType: 'Cash',
    totalAmount: 75.0,
    receivedAmount: 75.0,
    invoiceDate: '14/04/2026',
    paymentStatus: 'PAID',
    jobType: 'One Time',
    particulars: 'Tree trimming: 75.00',
    assignedTo: 'Rahul',
  },
  {
    id: '41318',
    jobId: '43026',
    franchise: 'Urban Lawn Care',
    customer: 'Sophia',
    paymentType: 'Card',
    totalAmount: 120.0,
    receivedAmount: 50.0,
    invoiceDate: '09/04/2026',
    paymentStatus: 'PENDING',
    jobType: 'Recurring',
    particulars: 'Monthly lawn maintenance: 120.00',
    assignedTo: 'Vikram',
  },
  {
    id: '41317',
    jobId: '43025',
    franchise: 'Nature Touch Landscaping',
    customer: 'Emma',
    paymentType: 'UPI',
    totalAmount: 90.0,
    receivedAmount: 90.0,
    invoiceDate: '01/04/2026',
    paymentStatus: 'PAID',
    jobType: 'One Time',
    particulars: 'Hedge cutting: 90.00',
    assignedTo: 'Sandeep',
  },
];
// Define columns for the Invoice DataTable
const InvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'jobId',
    header: 'Job',
  },
  // {
  //   accessorKey: 'franchise',
  //   header: 'Franchise',
  // },
  {
    accessorKey: 'customer',
    header: 'Customer',
  },

  {
    accessorKey: 'paymentType',
    header: 'Payment Type',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
  },
  {
    accessorKey: 'receivedAmount',
    header: 'Received Amount',
  },
  {
    accessorKey: 'invoiceDate',
    header: 'Invoice Date',
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Status',
    filterField: 'paymentStatus',
    filterOptions: ['PAID', 'OVERDUE', 'PENDING'],
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (row: Invoice) => (
      <div className="flex flex-wrap gap-2">
        <ActionButton
          icon={<Eye className="h-4 w-4" />}
          onClick={() => console.log('Viewing invoice:', row.id)}
        />
      </div>
    ),
  },
];

// Main Invoice Management Page Component
export default function InvoiceManagementPage() {
  const handleAddInvoice = () => {
    console.log('Add Invoice button clicked.');
  };

  return (
    <AppLayout>
      <main className="flex-1 w-full overflow-y-auto px-4 pt-9 pb-9">
        <div className="min-h-full w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#151515]">
                Invoice Management
              </h2>
              <p className="mt-1 text-[13px] text-[#777]">
                View and manage invoices linked to jobs.
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

          <DataTable<Invoice>
            data={Invoices}
            columns={InvoiceColumns}
            title="Invoices"
            description="View and manage invoices linked to jobs."
            addButtonLabel="+ Add Invoice"
            onAddClick={handleAddInvoice}
            searchPlaceholder="Search Invoices..."
            filterField="paymentStatus"
            filterOptions={['PAID', 'OVERDUE', 'PENDING']}
          />
        </div>
      </main>
    </AppLayout>
  );
}
