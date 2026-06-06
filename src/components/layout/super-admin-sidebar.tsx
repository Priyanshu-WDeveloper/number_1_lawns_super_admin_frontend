import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  TreePine,
  Star,
  Image,
  Settings,
  MessageSquareText,
  FileText,
  Shield,
  LogOutIcon,
  PanelLeftIcon,
  Globe,
  ArrowLeft,
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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import { localLogout } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/auth-slice';
import { api } from '@/API/api';


const mainItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/super-admin/dashboard',
  },
  { title: 'Admins', icon: Users, url: '/super-admin/admins' },
  { title: 'Billing', icon: CreditCard, url: '/super-admin/billing' },
  {
    title: 'Web Handling',
    icon: Globe,
    url: '/super-admin/new-lawns',
  },
];

const webItems = [
  {
    title: 'Services',
    icon: TreePine,
    url: '/super-admin/new-lawns/services',
  },
  {
    title: 'Reviews',
    icon: Star,
    url: '/super-admin/new-lawns/reviews',
  },
  {
    title: 'Gallery',
    icon: Image,
    url: '/super-admin/new-lawns/gallery',
  },
  {
    title: 'Contact Inquiries',
    icon: MessageSquareText,
    url: '/super-admin/new-lawns/contacts',
  },
  {
    title: 'Quote Requests',
    icon: FileText,
    url: '/super-admin/new-lawns/quotes',
  },
  {
    title: 'Website Config',
    icon: Settings,
    url: '/super-admin/new-lawns/website-config',
  },
];

export function SuperAdminSidebar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const isWebSection = location.pathname.startsWith(
    '/super-admin/new-lawns',
  );
  const currentItems = isWebSection ? webItems : mainItems;

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
    <Sidebar className="border-r-0">
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
            {isWebSection && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/super-admin/dashboard')}
                  className="h-11 rounded-2xl text-base hover:bg-[var(--sidebar-active)]"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {currentItems.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url!)}
                    isActive={
                      item.url === '/super-admin/new-lawns'
                        ? location.pathname ===
                          '/super-admin/new-lawns'
                        : location.pathname.startsWith(item.url)
                    }
                    className="h-11 rounded-2xl text-base hover:bg-[var(--sidebar-active)] data-[active=true]:bg-[var(--sidebar-active)]"
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
          onClick={() => setShowLogoutDialog(true)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <LogOutIcon className="h-5 w-5 text-sidebar" />
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
