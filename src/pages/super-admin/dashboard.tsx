import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Users, Shield, BarChart3, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SuperAdminDashboardPage = () => {
  return (
    <SuperAdminLayout>
      <main className="flex-1 w-full overflow-y-auto p-10">
        <div className="min-h-full w-full mt-[-25px]">
          <Navbar
            title="Super Admin Dashboard"
            subtitle="Overview of system administration"
            superAccess
          />

          <div className=" pt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-[20px] border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">
                    Total Admin Users
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    12
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">
                    Active Sessions
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    8
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">
                    System Status
                  </p>
                  <Badge
                    variant="default"
                    className="mt-2 bg-primary/10 text-primary border-primary/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">
                    Admin Actions
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    156
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      New admin user created
                    </p>
                    <p className="text-xs text-muted-foreground">
                      admin@no1lawns.com
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Login from new device
                    </p>
                    <p className="text-xs text-muted-foreground">
                      192.168.1.100
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  5 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      System settings updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Security policy modified
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  1 day ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboardPage;
