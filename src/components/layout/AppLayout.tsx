import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { StoreSelector } from '@/components/stores/StoreSelector';
import { useMobileBottomNavItems } from '@/hooks/useMobileBottomNavItems';
import { useStore } from '@/contexts/StoreContext';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Link } from 'react-router-dom';
import { laundrySite } from '@/lib/laundrySite';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOwner } = useStore();
  const bottomNavItems = useMobileBottomNavItems();

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="w-full overflow-x-hidden">
        {/* Top Header Bar with trigger */}
        <header
          className="sticky top-0 z-40 flex min-h-16 shrink-0 items-center gap-3 border-b bg-white px-4 sm:px-6"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1 min-w-0">
            <Link to="/" className="block truncate text-sm font-bold text-primary">{laundrySite.name}</Link>
            <span className="hidden text-xs text-muted-foreground sm:block">Dashboard pengelola</span>
          </div>
          {/* Store Selector for Owners */}
          {isOwner && (
            <div className="ml-auto shrink-0">
              <StoreSelector />
            </div>
          )}
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden bg-background">
          <div className="mx-auto max-w-7xl px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 md:pb-6 lg:pb-8">
            {children}
          </div>
        </main>
        <MobileBottomNav items={bottomNavItems} />
      </SidebarInset>
    </SidebarProvider>
  );
};
