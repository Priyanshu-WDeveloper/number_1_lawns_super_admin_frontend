'use client';

import * as React from 'react';
import {
  Search,
  Filter,
  Eye,
  Pencil,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CustomerStatus = 'Active' | 'Inactive';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  balance: number;
}

interface CustomerTableProps {
  data?: Customer[];
}

const customers: Customer[] = [
  {
    id: 'CUST-0001',
    name: 'Babu',
    email: 'babu.kondepudi@yahoo.co.nz',
    phone: '0211470500',
    city: '-',
    status: 'Active',
    balance: -80,
  },
  {
    id: 'CUST-0002',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0211234567',
    city: 'Auckland',
    status: 'Active',
    balance: 120,
  },
  {
    id: 'CUST-0003',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0227654321',
    city: 'Wellington',
    status: 'Inactive',
    balance: 0,
  },
  {
    id: 'CUST-0004',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '0219988776',
    city: 'Christchurch',
    status: 'Active',
    balance: 45.5,
  },
  {
    id: 'CUST-0005',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '0213344556',
    city: 'Hamilton',
    status: 'Active',
    balance: 10,
  },
];

export default function CustomerTable({
  data = customers,
}: CustomerTableProps) {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const filteredCustomers = data.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === 'all' || customer.status.toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="rounded-2xl h-full border w-full bg-white shadow-sm">
      <CardHeader className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="px-4">
          <CardTitle className="text-2xl font-bold">
            Customers
          </CardTitle>

          <CardDescription>
            Manage all your customers in one place.
          </CardDescription>
        </div>

        <Button className="h-10 rounded-xl">+ Add Customer</Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-muted/40">
              <tr className="border-b text-left">
                {[
                  'ID',
                  'Name',
                  'Email',
                  'Phone',
                  'City',
                  'Status',
                  'Balance',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-sm font-semibold text-muted-foreground"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4 text-sm font-medium">
                    {customer.id}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {customer.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {customer.email}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {customer.phone}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {customer.city}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        customer.status === 'Active'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : ''
                      }
                    >
                      {customer.status}
                    </Badge>
                  </td>

                  <td
                    className={`px-5 py-4 text-sm font-medium ${
                      customer.balance < 0
                        ? 'text-red-500'
                        : 'text-green-600'
                    }`}
                  >
                    {customer.balance.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton
                        icon={<Eye className="h-4 w-4" />}
                      />

                      <ActionButton
                        icon={<Pencil className="h-4 w-4" />}
                      />

                      <ActionButton
                        icon={<Wallet className="h-4 w-4" />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1 to 5 of 25 entries
          </p>

          <div className="flex items-center gap-2">
            <PaginationButton icon={<ChevronLeft />} />

            <PaginationButton label="1" active />

            <PaginationButton label="2" />

            <PaginationButton label="3" />

            <span className="px-2 text-muted-foreground">...</span>

            <PaginationButton label="5" />

            <PaginationButton icon={<ChevronRight />} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------- */
/* Reusable Action Button */
/* -------------------------- */

interface ActionButtonProps {
  icon: React.ReactNode;
  // Removed 'label' as per user request for icon-only buttons
}

function ActionButton({ icon }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 rounded-xl border-green-200 text-green-700 hover:bg-green-50 hover:text-green-700"
    >
      {icon}
      {/* label is no longer rendered */}
    </Button>
  );
}

/* -------------------------- */
/* Reusable Pagination Button */
/* -------------------------- */

interface PaginationButtonProps {
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

function PaginationButton({
  label,
  icon,
  active,
}: PaginationButtonProps) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="icon"
      className={`h-9 w-9 rounded-lg ${active ? '' : 'bg-white'}`}
    >
      {icon || label}
    </Button>
  );
}
