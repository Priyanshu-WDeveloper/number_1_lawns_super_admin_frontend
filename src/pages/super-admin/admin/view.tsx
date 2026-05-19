import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGetAdminUserByIdQuery } from '../../../API/api';
import { ROUTES } from '@/constants';
import Loader from '../../../components/loader';
import type { IAdmins } from '../../../types/admins.types';

export default function AdminViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedAdmin = location.state?.admin as IAdmins | undefined;

  const { data, isLoading } = useGetAdminUserByIdQuery(id, {
    skip: !!passedAdmin,
  });

  const admin = passedAdmin ?? data?.admin;

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!admin) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-[#777]">Admin not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-10">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.SUPER_ADMIN_ADMINS)}
          className="mb-4 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admins
        </Button>

        <div className="mb-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-[#16610E] text-white">
                <AvatarFallback className="text-xl font-bold">
                  {getInitials(admin.firstName, admin.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#151515]">
                    {admin.firstName} {admin.lastName}
                  </h1>
                  <Badge className="bg-[#16610E] text-white">
                    {admin.adminId}
                  </Badge>
                </div>
                <p className="text-[#777] text-sm mt-1">
                  Admin Details
                </p>
              </div>
            </div>
            <Badge
              className={`${statusColors[admin.status] || statusColors.inactive} border px-3 py-1`}
            >
              {admin.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf8e7]">
                <User className="h-4 w-4 text-[#16610E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#151515]">
                Personal Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8f8f5]">
                  <span className="text-xs font-semibold text-[#151515]">
                    ID
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#777]">Admin ID</p>
                  <p className="text-[#151515] font-medium">
                    {admin.adminId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-[#777]" />
                <div>
                  <p className="text-sm text-[#777]">Full Name</p>
                  <p className="text-[#151515] font-medium">
                    {admin.firstName} {admin.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[#777]" />
                <div>
                  <p className="text-sm text-[#777]">Role</p>
                  <p className="text-[#151515] font-medium">
                    {admin.role === 1 ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf8e7]">
                <Mail className="h-4 w-4 text-[#16610E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#151515]">
                Contact Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#777]" />
                <div>
                  <p className="text-sm text-[#777]">Email Address</p>
                  <p className="text-[#151515] font-medium">
                    {admin.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#777]" />
                <div>
                  <p className="text-sm text-[#777]">Phone Number</p>
                  <p className="text-[#151515] font-medium">
                    {admin.countryCode} {admin.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf8e7]">
                <MapPin className="h-4 w-4 text-[#16610E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#151515]">
                Address
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-[#777]">Address</p>
                <p className="text-[#151515] font-medium mt-1">
                  {admin.address || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#777]">City</p>
                <p className="text-[#151515] font-medium mt-1">
                  {admin.city || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#777]">State</p>
                <p className="text-[#151515] font-medium mt-1">
                  {admin.state || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#777]">Postal Code</p>
                <p className="text-[#151515] font-medium mt-1">
                  {admin.postalCode || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#777]">Country</p>
                <p className="text-[#151515] font-medium mt-1">
                  {admin.country || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() =>
              navigate(ROUTES.ADMIN_EDIT.replace(':id', admin._id), {
                state: { admin },
              })
            }
            className="h-12 rounded-xl bg-[#16610E] px-8 text-white hover:bg-[#1a7a12]"
          >
            Edit Admin
          </Button>
        </div>
      </div>
    </div>
    </SuperAdminLayout>
  );
}
