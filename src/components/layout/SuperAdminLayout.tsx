import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SuperAdminSidebar } from '@/components/layout/super-admin-sidebar';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({
  children,
}: SuperAdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden w-full bg-[#F4F7EF]">
        <div className="flex h-full rounded-[22px] bg-[#f8f8f5] shadow-xl">
          <SuperAdminSidebar />
          <main className="flex-1 overflow-hidden px-4 md:ml-12 flex flex-col">
            {/* Mobile menu toggle */}
            <div className="md:hidden pt-4 shrink-0">
              <SidebarTrigger className="h-10 w-10 rounded-lg bg-white border border-[#ececec] shadow-sm" />
            </div>
            <div className="flex-1 min-h-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
