import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { Navbar } from '@/components/layout/Navbar';
import {
  Users,
  Shield,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SuperAdminDashboardPage = () => {

  return (
    <SuperAdminLayout>
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="min-h-full w-full">
          <Navbar
            title="Super Admin Dashboard"
            subtitle="Overview of system administration"
            superAccess
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-[20px] border border-[#ececec] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#777]">
                    Total Admin Users
                  </p>
                  <p className="text-2xl font-bold text-[#151515] mt-1">
                    12
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#edf8e7] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#16610E]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-[#ececec] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#777]">
                    Active Sessions
                  </p>
                  <p className="text-2xl font-bold text-[#151515] mt-1">
                    8
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#edf8e7] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#16610E]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-[#ececec] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#777]">
                    System Status
                  </p>
                  <Badge
                    variant="default"
                    className="mt-2 bg-[#edf8e7] text-[#16610E] border-[#16610E]/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#edf8e7] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#16610E]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-[#ececec] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#777]">
                    Admin Actions
                  </p>
                  <p className="text-2xl font-bold text-[#151515] mt-1">
                    156
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#edf8e7] flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[#16610E]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#ececec] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#151515] mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#ececec]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#edf8e7] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#16610E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#151515]">
                      New admin user created
                    </p>
                    <p className="text-xs text-[#777]">
                      admin@no1lawns.com
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#777]">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#ececec]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#edf8e7] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#16610E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#151515]">
                      Login from new device
                    </p>
                    <p className="text-xs text-[#777]">
                      192.168.1.100
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#777]">
                  5 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#edf8e7] flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#16610E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#151515]">
                      System settings updated
                    </p>
                    <p className="text-xs text-[#777]">
                      Security policy modified
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#777]">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboardPage;
