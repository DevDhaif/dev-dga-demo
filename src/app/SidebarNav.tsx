import { Link, useLocation } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@dev-dga/react';
import { NAV_GROUPS, type NavItem, type NavSubItem } from './nav';
import { openRequestsCount } from '@/store/selectors';
import { useStore } from '@/store/store-context';
import { useT } from '@/i18n';

function OpenRequestsBadge() {
  const { state } = useStore();
  const n = openRequestsCount(state);
  return n > 0 ? <SidebarMenuBadge>{n.toLocaleString('en-US')}</SidebarMenuBadge> : null;
}

function SubLink({ sub }: { sub: NavSubItem }) {
  const t = useT();
  const { pathname, search } = useLocation();
  return (
    <SidebarMenuSubButton asChild isActive={pathname + search === sub.to}>
      <Link to={sub.to}>{t(sub.labelKey)}</Link>
    </SidebarMenuSubButton>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const t = useT();
  const Icon = item.icon;
  const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
  return (
    <SidebarMenuButton asChild isActive={active} tooltip={t(item.labelKey)}>
      <Link to={item.path}>
        <Icon size={18} />
        <span>{t(item.labelKey)}</span>
        {item.badge === 'openRequests' && <OpenRequestsBadge />}
      </Link>
    </SidebarMenuButton>
  );
}

export function NavList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <NavLink item={item} pathname={pathname} />
          {item.children && (
            <SidebarMenuSub>
              {item.children.map((sub) => (
                <SidebarMenuSubItem key={sub.to}>
                  <SubLink sub={sub} />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function NavGroups({ pathname }: { pathname: string }) {
  const t = useT();
  return (
    <>
      {NAV_GROUPS.map((group, i) => (
        <SidebarGroup key={group.labelKey}>
          {i > 0 && <SidebarSeparator />}
          <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavList items={group.items} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
