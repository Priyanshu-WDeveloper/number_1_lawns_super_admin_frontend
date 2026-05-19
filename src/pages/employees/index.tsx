import { useMemo } from 'react';
import { Eye, Pencil } from 'lucide-react';
import type { ColumnDef } from '@/components/data-table/DataTable';
import DataTable, {
  ActionButton,
} from '@/components/data-table/DataTable';
import { AppLayout } from '@/components/layout/AppLayout';
import { Navbar } from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { useEmployeeStore } from '@/store/employeeStore';
import { ROUTES } from '@/constants';

interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
}

const sampleEmployees: EmployeeRow[] = [
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
];

export default function EmployeeManagementPage() {
  const navigate = useNavigate();
  const employees = useEmployeeStore((state) => state.employees);

  const allEmployees = useMemo(() => {
    const storeEmployees: EmployeeRow[] = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role || 'Employee',
      department: emp.department || 'General',
      status: emp.status,
    }));
    return [...sampleEmployees, ...storeEmployees];
  }, [employees]);

  const employeeColumns: ColumnDef<EmployeeRow>[] = [
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
      cell: (row: EmployeeRow) => (
        <div className="flex flex-wrap gap-2">
          <ActionButton
            intent="view"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.EMPLOYEES_VIEW.replace(':id', row.id))}
          />
          <ActionButton
            intent="edit"
            icon={<Pencil className="h-4 w-4" />}
            onClick={() => console.log('Edit employee:', row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="min-h-full w-full">
          <Navbar
            title="Employee Management"
            subtitle="Manage your employees and view their details."
            showWelcome={false}
          />

          <DataTable<EmployeeRow>
            data={allEmployees}
            columns={employeeColumns}
            title="Employees"
            description="Manage all your employees in one place."
            searchPlaceholder="Search employees..."
            filterField="status"
            filterOptions={['Active', 'Inactive']}
            addButtonLabel="Add Employee"
            onAddClick={() => navigate(ROUTES.EMPLOYEES_CREATE)}
          />
        </div>
      </main>
    </AppLayout>
  );
}