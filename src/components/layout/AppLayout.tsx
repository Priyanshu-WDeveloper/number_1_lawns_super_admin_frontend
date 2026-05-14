'use client';

import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden w-full bg-[#F4F7EF]">
        <div className="flex h-full rounded-[22px] bg-[#f8f8f5] shadow-xl">
          {/* Sidebar */}
          <div className="w-78 hidden sm:block flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main Content Area */}
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
