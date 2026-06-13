import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  CircleHelp,
  Users,
  FolderOpen,
  History,
  Landmark,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { I18nKey } from '@/i18n';

export interface NavSubItem {
  to: string;
  labelKey: I18nKey;
}

export interface NavItem {
  path: string;
  labelKey: I18nKey;
  icon: LucideIcon;
  badge?: 'openRequests';
  children?: NavSubItem[];
}

export interface NavGroup {
  labelKey: I18nKey;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: 'nav.groupOperations',
    items: [
      { path: '/', labelKey: 'nav.overview', icon: LayoutDashboard },
      {
        path: '/requests',
        labelKey: 'nav.requests',
        icon: Inbox,
        badge: 'openRequests',
        children: [
          { to: '/requests?status=new', labelKey: 'status.new' },
          { to: '/requests?status=in_review', labelKey: 'status.in_review' },
        ],
      },
      { path: '/appointments', labelKey: 'nav.appointments', icon: CalendarDays },
      { path: '/documents', labelKey: 'nav.documents', icon: FolderOpen },
    ],
  },
  {
    labelKey: 'nav.groupResources',
    items: [
      { path: '/staff', labelKey: 'nav.staff', icon: Users },
      { path: '/services', labelKey: 'nav.services', icon: Landmark },
      { path: '/reports', labelKey: 'nav.reports', icon: BarChart3 },
      { path: '/activity', labelKey: 'nav.activity', icon: History },
    ],
  },
];

export const NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const NAV_FOOTER: NavItem[] = [
  { path: '/help', labelKey: 'nav.help', icon: CircleHelp },
  { path: '/settings', labelKey: 'nav.settings', icon: Settings },
];

const HIDDEN_NAV: NavItem[] = [{ path: '/profile', labelKey: 'account.title', icon: CircleHelp }];

export function activeNavItem(pathname: string): NavItem | undefined {
  return [...NAV, ...NAV_FOOTER, ...HIDDEN_NAV].find((i) =>
    i.path === '/' ? pathname === '/' : pathname.startsWith(i.path),
  );
}
