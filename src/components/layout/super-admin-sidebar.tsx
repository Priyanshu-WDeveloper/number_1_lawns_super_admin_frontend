import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  Shield,
  KeyRound,
  LogOutIcon,
  TreePine,
  PhoneCall,
  Star,
  HelpCircle,
  Map,
  Image,
  FileText,
  Phone,
  UserCircle,
  Tag,
  BarChart3,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { PanelLeftIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// import { useLogoutMutation } from '@/store/api';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import { localLogout } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/auth-slice';
import { api } from '@/API/api';
import { ChangeSuperAdminPasswordDialog } from '@/pages/super-admin/change-password';

const items = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/super-admin/dashboard',
  },
  {
    title: 'Admins',
    icon: Users,
    url: '/super-admin/admins',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    url: '/super-admin/billing',
  },
  { type: 'label', label: 'No. 1 Lawns' },
  { title: 'Services', icon: TreePine, url: '/super-admin/new-lawns/services' },
  { title: 'Leads', icon: PhoneCall, url: '/super-admin/new-lawns/leads' },
  { title: 'Reviews', icon: Star, url: '/super-admin/new-lawns/reviews' },
  { title: 'FAQs', icon: HelpCircle, url: '/super-admin/new-lawns/faqs' },
  { title: 'Areas', icon: Map, url: '/super-admin/new-lawns/areas' },
  { title: 'Gallery', icon: Image, url: '/super-admin/new-lawns/gallery' },
  { title: 'Page Content', icon: FileText, url: '/super-admin/new-lawns/page-content' },
  { title: 'Contact Info', icon: Phone, url: '/super-admin/new-lawns/contact-info' },
  { title: 'Team', icon: UserCircle, url: '/super-admin/new-lawns/team' },
  { title: 'Promotions', icon: Tag, url: '/super-admin/new-lawns/promotions' },
  { title: 'Stats', icon: BarChart3, url: '/super-admin/new-lawns/stats' },
];

export function SuperAdminSidebar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();

  const [confirmAction, setConfirmAction] = useState<{
    type: 'change-password';
  } | null>(null);

  const handleLogout = async () => {
    try {
      localLogout();
      dispatch(clearAuth());
      dispatch(api.util.resetApiState());
      toast.success('Logged out');
      setShowLogoutDialog(false);

      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar className="border-r-0 w-78">
      <SidebarHeader className="bg-gradient-to-b from-[var(--sidebar-bg-from)] to-[var(--sidebar-bg-to)] border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Shield className="h-5 w-5 text-sidebar" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Super Admin
            </h2>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <PanelLeftIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-[var(--sidebar-bg-from)] to-[var(--sidebar-bg-to)]">
        <SidebarGroup>
          <SidebarMenu className="space-y-2 px-3">
            {items.map((item) => {
              if ('type' in item && item.type === 'label') {
                return (
                  <div
                    key={item.label}
                    className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-white/50"
                  >
                    {item.label}
                  </div>
                );
              }
              if (!('url' in item)) return null;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url!)}
                    isActive={location.pathname === item.url}
                    className="h-14 rounded-2xl text-base hover:bg-[var(--sidebar-active)] data-[active=true]:bg-[var(--sidebar-active)]"
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[var(--sidebar-bg-to)] p-4 space-y-2">
        <button
          className="w-full rounded-2xl bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/20"
          // onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
          onClick={() =>
            setConfirmAction({
              type: 'change-password',
            })
          }
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <KeyRound className="h-5 w-5 text-sidebar" />
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">
                Change Password
              </h4>

              <p className="text-sm text-white/70">Update password</p>
            </div>
          </div>
        </button>

        <button
          className="w-full rounded-2xl bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/20"
          onClick={() => setShowLogoutDialog(true)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <span className="font-bold text-sidebar">
                <LogOutIcon />
              </span>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">
                Logout (Super Admin)
              </h4>

              <p className="text-sm text-white/70">Control Panel</p>
            </div>
          </div>
        </button>
      </SidebarFooter>

      <ChangeSuperAdminPasswordDialog
        open={confirmAction?.type === 'change-password'}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      />

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Logout"
        description="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        onConfirm={handleLogout}
      />
    </Sidebar>
  );
}
