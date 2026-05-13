'use client';

import React from 'react';
import { DashboardSidebar } from '../layout/Sidebar'; // Reverted import
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden w-full bg-[#F4F7EF]">
        <div className="flex h-full rounded-[22px] bg-[#f8f8f5] shadow-xl">
          {/* Sidebar */}
          <div className="w-78 flex-shrink-0">
            <DashboardSidebar /> {/* Reverted usage */}
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
