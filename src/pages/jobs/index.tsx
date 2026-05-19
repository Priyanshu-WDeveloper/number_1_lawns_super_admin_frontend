import { Eye, LucideTrash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { ColumnDef } from '@/components/data-table/DataTable';
import DataTable, {
  ActionButton,
} from '@/components/data-table/DataTable';
import { AppLayout } from '@/components/layout/AppLayout';
import { Navbar } from '@/components/layout/Navbar';
import { ROUTES } from '@/constants';

// Define the structure for Job data
interface Job {
  id?: string;
  address: string;
  date: string;
  paymentType: 'Cash' | 'Card' | 'Online' | 'UPI' | 'Bank Transfer';
  status: 'Pending' | 'Completed' | 'Cancelled';
  jobType: string;
  particulars: string;
  assignedTo?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
}

// Sample Job Data
const Jobs: Job[] = [
  {
    id: 'JOB-001',
    address: '123 Main Street, Delhi',
    date: '2026-05-10',
    paymentType: 'Cash',
    status: 'Completed',
    jobType: 'Installation',
    particulars: 'AC installation service',
    assignedTo: 'Rahul Verma',
    // name: 'Rahul Verma',
    // email: 'rahul@example.com',
    // phone: '+91 9876543210',
    // role: 'Technician',
    // department: 'Installation',
  },
  {
    id: 'JOB-002',
    address: '45 Park Avenue, Mumbai',
    date: '2026-05-11',
    paymentType: 'Card',
    status: 'Pending',
    jobType: 'Repair',
    particulars: 'Washing machine repair',
    assignedTo: 'Amit Singh',
  },
  {
    id: 'JOB-003',
    address: '78 Lake View, Bangalore',
    date: '2026-05-12',
    paymentType: 'UPI',
    status: 'Cancelled',
    jobType: 'Maintenance',
    particulars: 'Electrical maintenance',
    assignedTo: 'Karan Mehta',
  },
  {
    id: 'JOB-004',
    address: '12 Green Colony, Chandigarh',
    date: '2026-05-13',
    paymentType: 'Bank Transfer',
    status: 'Completed',
    jobType: 'Inspection',
    particulars: 'Generator inspection',
    assignedTo: 'Sandeep Kumar',
  },
  {
    id: 'JOB-005',
    address: '90 River Road, Pune',
    date: '2026-05-14',
    paymentType: 'Cash',
    status: 'Pending',
    jobType: 'Cleaning',
    particulars: 'Water tank cleaning',
    assignedTo: 'Vikram Joshi',
  },
];

// Main Job Management Page Component
export default function JobManagementPage() {
  const navigate = useNavigate();

  // Define columns inside component to access navigate
  const JobColumns: ColumnDef<Job>[] = [
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
    },
    {
      accessorKey: 'jobType',
      header: 'Job type',
    },
    {
      accessorKey: 'particulars',
      header: 'Particulars',
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      filterField: 'status',
      filterOptions: ['Pending', 'Completed', 'Cancelled'],
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row: Job) => (
        <div className="flex flex-wrap gap-2">
          <ActionButton
            intent="view"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => navigate(`/jobs/${row.id}`)}
          />
          <ActionButton
            intent="edit"
            icon={<Pencil className="h-4 w-4" />}
            onClick={() =>
              console.log('Editing job with ID:', row.id)
            }
          />
          <ActionButton
            intent="delete"
            className="hover:text-white hover:bg-red-600"
            icon={<LucideTrash2 className="h-4 w-4 " />}
            onClick={() =>
              console.log('Deleting access for job ID:', row.id)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      {/* <main className="flex-1 w-full overflow-y-auto px-4 pt-9 pb-9"> */}
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="min-h-full w-full">
          <Navbar
            title="Job Management"
            subtitle="Manage your Jobs and view their details."
            showWelcome={false}
          />

          <DataTable<Job>
            data={Jobs}
            columns={JobColumns}
            title="Jobs"
            description="Manage all your Jobs in one place."
            searchPlaceholder="Search Jobs..."
            filterField="status"
            filterOptions={['Active', 'Inactive']}
            addButtonLabel="Add Job"
            onAddClick={() => navigate(ROUTES.JOBS_CREATE)}
          />
        </div>
      </main>
    </AppLayout>
  );
}
