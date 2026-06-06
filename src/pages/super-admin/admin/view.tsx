import { useState } from 'react';
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
  Pencil,
  Ellipsis,
  LogIn,
  Building2,
  ToggleLeft,
  Lock,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/data-table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
} from '@/API/api';
import { ROUTES } from '@/constants';
import Loader from '@/components/loader';
import type { IAdmins } from '@/types/admins.types';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/get-error-message';
import { StaticMap } from '@/components/google-maps/static-map';

export default function AdminViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedAdmin = location.state?.admin as IAdmins | undefined;
  const [updateAdminUser] = useUpdateAdminUserMutation();
  const [profileImgState, setProfileImgState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const { data, isLoading, refetch } = useGetAdminUserByIdQuery(id!, {
    skip: !!passedAdmin,
  });

  const admin = passedAdmin ?? data;

  const handleStatusChange = async (
    id: string,
    status: 'active' | 'inactive',
  ) => {
    try {
      const res = await updateAdminUser({ id, status }).unwrap();
      console.log(
        '\n===================== 🟢 res =====================',
      );
      console.log(res);
      console.log(
        '=================================================\n',
      );
      refetch();
      toast.success(`Admin set to ${status}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    }
  };

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
          <p className="text-muted-foreground">Admin not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const statusColors: Record<string, string> = {
    active: 'bg-primary/10 text-primary border-primary/20',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.SUPER_ADMIN_ADMINS)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admins
          </Button>

          <div className="mb-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {admin.profileImage && profileImgState !== 'error' && (
                    <AvatarImage
                      src={admin.profileImage}
                      alt={admin.firstName}
                      onLoad={() => setProfileImgState('loaded')}
                      onError={() => setProfileImgState('error')}
                    />
                  )}
                  {profileImgState !== 'loaded' && (
                    <AvatarFallback className="text-xl font-bold">
                      {getInitials(admin.firstName, admin.lastName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {admin.firstName} {admin.lastName}
                    </h1>

                    {/* <Badge className="bg-primary text-white">
                      {admin.adminId}
                    </Badge> */}
                  </div>
                  {/* <p className="text-muted-foreground text-sm mt-1">
                    Admin Details
                  </p> */}
                  <Badge
                    className={`${statusColors[admin.status] || statusColors.inactive} border px-3 py-1`}
                  >
                    {admin.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <ActionButton
                  icon={<Pencil className="h-3.5 w-3.5" />}
                  className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
                  onClick={() =>
                    navigate(
                      ROUTES.ADMIN_EDIT.replace(':id', admin._id),
                      {
                        state: { admin },
                      },
                    )
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
                    <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(admin.email);
                      window.open(
                        `${import.meta.env.VITE_ADMIN_PANEL_URL}?email=${encodeURIComponent(admin.email)}`,
                        '_blank',
                      );
                      toast.success(
                        'Admin email copied. Login page opened.',
                      );
                    }}
                      className="truncate"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login as Admin
                    </DropdownMenuItem>
                    {admin.status === 'active' ? (
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() =>
                          handleStatusChange(admin._id, 'inactive')
                        }
                      >
                        <ToggleLeft className="mr-2 h-4 w-4" />
                      Set Inactive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-primary focus:text-primary"
                        onClick={() =>
                          handleStatusChange(admin._id, 'active')
                        }
                      >
                        <ToggleLeft className="mr-2 h-4 w-4" />
                      Set Active
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        toast.success(
                          'Change Password — frontend only',
                        );
                      }}
                      className="truncate"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Details
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8f8f5]">
                    <span className="text-xs font-semibold text-foreground">
                      ID
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Admin ID</p>
                    <p className="text-foreground font-medium">
                      {admin.adminId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-foreground font-medium">
                      {admin.firstName} {admin.lastName}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-foreground font-medium">
                      {admin.role === 1 ? 'Super Admin' : 'Admin'}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                    <p className="text-foreground font-medium">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="text-foreground font-medium">
                      {admin.countryCode} {admin.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Address
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground font-medium mt-1">
                    {admin.address || '-'}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="text-foreground font-medium mt-1">
                      {admin.city || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="text-foreground font-medium mt-1">
                      {admin.state || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Postal Code</p>
                    <p className="text-foreground font-medium mt-1">
                      {admin.postalCode || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-foreground font-medium mt-1">
                      {admin.country || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Company Details</h3>
                </div>
                {admin.invoiceLogo && (
                  <img src={admin.invoiceLogo} alt="Invoice Logo" className="h-10 w-10 rounded object-cover" />
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="text-foreground font-medium mt-1">{admin.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <p className="text-foreground font-medium mt-1">{admin.gstNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Account</p>
                  <p className="text-foreground font-medium mt-1">{admin.bankAccountNumber || '-'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
              <StaticMap
                lat={admin.location?.coordinates?.[1] ?? 0}
                lng={admin.location?.coordinates?.[0] ?? 0}
                height={280}
              />
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
