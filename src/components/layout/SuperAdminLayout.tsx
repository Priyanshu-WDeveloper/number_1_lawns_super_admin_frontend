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
          {/* Sidebar - uses internal mobile detection to show as drawer */}
          <div className="w-78 hidden sm:block flex-shrink-0">
            <SuperAdminSidebar />
          </div>
          <main className="flex-1 overflow-y-auto px-4">
            {/* Mobile menu toggle */}
            <div className="md:hidden pt-4">
              <SidebarTrigger className="h-10 w-10 rounded-lg bg-white border border-[#ececec] shadow-sm" />
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
