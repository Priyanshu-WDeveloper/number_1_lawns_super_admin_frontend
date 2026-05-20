import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  MoreVertical,
  Pencil,
  Trash2,
  Wallet,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ROUTES } from '@/constants';
import { StaticMap } from '@/components/google-maps/StaticMap';
import {
  useGetCustomerByIdQuery,
  useToggleCustomerStatusMutation,
} from '../../API/api';
import type { ICustomer } from '../../types';
import Loader from '../../components/loader';
import toast from 'react-hot-toast';
import { formatDate } from '../../lib/format-date';
import { StatusBadge } from '../../components/data-table/StatusBadge';

const statusConfig: Record<string, { color: string; label: string }> =
  {
    active: { color: '#22c55e', label: 'Active' },
    inactive: { color: '#ef4444', label: 'Inactive' },
    expired: { color: '#f59e0b', label: 'Expired' },
  };

export default function CustomerViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-[#777]">Invalid customer ID</p>
        </div>
      </AppLayout>
    );
  }
  const location = useLocation();
  const passedCustomer = location.state?.customer as
    | ICustomer
    | undefined;
  const [toggleCustomerStatus] = useToggleCustomerStatusMutation();

  const { data, isLoading } = useGetCustomerByIdQuery(id, {
    skip: !!passedCustomer,
  });

  const customer = passedCustomer ?? data;

  const handleStatusChange = async (
    status: 'active' | 'inactive',
  ) => {
    if (!customer) return;
    try {
      await toggleCustomerStatus({
        id: customer._id,
        status,
      }).unwrap();
      toast.success(`Customer set to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const lat = customer?.location?.coordinates?.[1];
  const lng = customer?.location?.coordinates?.[0];

  if (isLoading) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-[#777]">Customer not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto pl-10 p-5">
          <div className="mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.CUSTOMERS)}
              className="mb-4 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>

            {/* Header Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-[#16610E] text-white">
                    <AvatarFallback className="text-xl font-bold">
                      {getInitials(customer.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-[#151515]">
                      {customer.fullName}
                    </h1>
                    <p className="text-[#777] text-sm">
                      Customer ID: {customer._id}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <StatusBadge
                      status={customer.status}
                      config={statusConfig}
                    />

                    <div className="mt-2">
                      <span
                        className={`text-lg font-semibold ${
                          customer.balance < 0
                            ? 'text-red-500'
                            : 'text-green-600'
                        }`}
                      >
                        {customer.balance < 0 ? '-' : ''}$
                        {Math.abs(customer.balance).toFixed(2)}
                      </span>

                      <p className="text-xs text-[#777]">Balance</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-52 rounded-2xl"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            ROUTES.CUSTOMERS_EDIT.replace(
                              ':id',
                              customer._id,
                            ),
                            { state: { customer } },
                          )
                        }
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                        Edit Customer
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/customers/wallet/${customer._id}`,
                          )
                        }
                        className="cursor-pointer"
                      >
                        <Wallet className="mr-2 h-4 w-4 text-green-600" />
                        Wallet
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {customer.status === 'active' ? (
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() =>
                            handleStatusChange('inactive')
                          }
                        >
                          Set Inactive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-green-600 focus:text-green-600"
                          onClick={() => handleStatusChange('active')}
                        >
                          Set Active
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          console.log(
                            'Delete customer:',
                            customer._id,
                          )
                        }
                        className="cursor-pointer text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Information Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <Mail className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Name</p>
                      <p className="text-[#151515] font-medium">
                        {customer.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Email</p>
                      <p className="text-[#151515] font-medium">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Phone</p>
                      <p className="text-[#151515] font-medium">
                        {customer.countryCode} {customer.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Summary Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] ">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Account Summary
                  </h3>
                </div>
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> */}
                <div className="space-y-4">
                  {/* <div>
                    <p className="text-sm text-[#777]">Status</p>
                    <StatusBadge
                      status={customer.status}
                      config={statusConfig}
                    />
                  </div> */}
                  <div>
                    <p className="text-sm text-[#777]">Managed By</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {customer.parentAdmin || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Created At</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">
                      Last Updated
                    </p>
                    <p className="text-[#151515] font-medium mt-1">
                      {formatDate(customer.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Details Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Address Details
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[#777] mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#777]">
                        Street Address
                      </p>
                      <p className="text-[#151515] font-medium">
                        {customer.address || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-[#777]">City</p>
                      <p className="text-[#151515] font-medium">
                        {customer.city || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#777]">State</p>
                      <p className="text-[#151515] font-medium">
                        {customer.state || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#777]">
                        Postal Code
                      </p>
                      <p className="text-[#151515] font-medium">
                        {customer.postalCode || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#777]">Country</p>
                      <p className="text-[#151515] font-medium">
                        {customer.country || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Embedded Google Map */}
                  {lat && lng && (
                    <StaticMap lat={lat} lng={lng} height={250} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
