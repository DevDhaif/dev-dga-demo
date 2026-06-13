'use client';

import { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  ScrollArea,
  Spinner,
  Toaster,
  useSidebar,
} from '@dev-dga/react';
import { NAV_FOOTER, activeNavItem } from './nav';
import { NavGroups, NavList } from './SidebarNav';
import { Topbar } from './Topbar';
import { useAuth } from './use-auth';
import { useT } from '@/i18n';

function Brand() {
  const t = useT();
  const { state, isMobile } = useSidebar();
  const showName = isMobile || state === 'expanded';
  return (
    <div className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-2">
      <img src="/favicon.svg" alt="" className="h-5 w-5 shrink-0" />
      {showName && <strong>{t('app.name')}</strong>}
    </div>
  );
}

export function AppShell() {
  const t = useT();
  const { authed } = useAuth();
  const { pathname } = useLocation();
  const currentLabel = t(activeNavItem(pathname)?.labelKey ?? 'notFound.title');

  useEffect(() => {
    document.title = `${currentLabel} · ${t('app.name')}`;
  }, [currentLabel, t]);

  if (!authed) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon" aria-label={t('shell.navigation')}>
        <SidebarHeader>
          <Brand />
        </SidebarHeader>
        <SidebarContent>
          <NavGroups pathname={pathname} />
        </SidebarContent>
        <SidebarFooter>
          <NavList items={NAV_FOOTER} pathname={pathname} />
        </SidebarFooter>
        <SidebarRail aria-label={t('shell.toggleSidebar')} />
      </Sidebar>

      <SidebarInset>
        <Topbar />
        <div className="flex items-center gap-2 px-3 py-2">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="p-(--ddga-space-4)">
            <Suspense
              fallback={
                <div className="flex justify-center py-16">
                  <Spinner size="lg" aria-label={t('common.loading')} />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </ScrollArea>
      </SidebarInset>

      <Toaster position="bottom-end" />
    </SidebarProvider>
  );
}
