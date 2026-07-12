/* eslint-disable react-refresh/only-export-components -- route-config module: exports the router, not fast-refreshable components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { RouteError } from '@/views/RouteError';

const Overview = lazy(() => import('@/views/Overview').then((m) => ({ default: m.Overview })));
const RequestsQueue = lazy(() =>
  import('@/views/RequestsQueue').then((m) => ({ default: m.RequestsQueue })),
);
const RequestForm = lazy(() =>
  import('@/views/RequestForm').then((m) => ({ default: m.RequestForm })),
);
const RequestDetail = lazy(() =>
  import('@/views/RequestDetail').then((m) => ({ default: m.RequestDetail })),
);
const Appointments = lazy(() =>
  import('@/views/Appointments').then((m) => ({ default: m.Appointments })),
);
const StaffDirectory = lazy(() =>
  import('@/views/StaffDirectory').then((m) => ({ default: m.StaffDirectory })),
);
const StaffProfile = lazy(() =>
  import('@/views/StaffProfile').then((m) => ({ default: m.StaffProfile })),
);
const DocumentCenter = lazy(() =>
  import('@/views/DocumentCenter').then((m) => ({ default: m.DocumentCenter })),
);
const ServiceCatalog = lazy(() =>
  import('@/views/ServiceCatalog').then((m) => ({ default: m.ServiceCatalog })),
);
const ServicePage = lazy(() =>
  import('@/views/ServicePage').then((m) => ({ default: m.ServicePage })),
);
const Reports = lazy(() => import('@/views/Reports').then((m) => ({ default: m.Reports })));
const ActivityLog = lazy(() =>
  import('@/views/ActivityLog').then((m) => ({ default: m.ActivityLog })),
);
const Help = lazy(() => import('@/views/Help').then((m) => ({ default: m.Help })));
const Settings = lazy(() => import('@/views/Settings').then((m) => ({ default: m.Settings })));
const Login = lazy(() => import('@/views/Login').then((m) => ({ default: m.Login })));
const Profile = lazy(() => import('@/views/Profile').then((m) => ({ default: m.Profile })));
const NotFound = lazy(() => import('@/views/NotFound').then((m) => ({ default: m.NotFound })));

export const router = createBrowserRouter([
  { path: '/login', Component: Login, ErrorBoundary: RouteError },
  {
    path: '/',
    Component: AppShell,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Overview },
      { path: 'requests', Component: RequestsQueue },
      { path: 'requests/new', Component: RequestForm },
      { path: 'requests/:id', Component: RequestDetail },
      { path: 'requests/:id/edit', Component: RequestForm },
      { path: 'appointments', Component: Appointments },
      { path: 'staff', Component: StaffDirectory },
      { path: 'staff/:id', Component: StaffProfile },
      { path: 'documents', Component: DocumentCenter },
      { path: 'services', Component: ServiceCatalog },
      { path: 'services/:slug', Component: ServicePage },
      { path: 'reports', Component: Reports },
      { path: 'activity', Component: ActivityLog },
      { path: 'help', Component: Help },
      { path: 'settings', Component: Settings },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
]);
