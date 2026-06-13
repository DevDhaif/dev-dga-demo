import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
  List,
  ListItem,
  ListItemAction,
  ListItemContent,
  ListItemIcon,
} from '@dev-dga/react';
import { Bell, BellOff, Check, CalendarCheck, FileCheck, FileUp, Inbox } from 'lucide-react';
import type { ActivityKind } from '@/data/types';
import { formatDateTime } from '@/data/labels';
import { unreadActivity } from '@/store/selectors';
import { useStore } from '@/store/store-context';
import { tField, useLang, useT } from '@/i18n';

const KIND_ICON: Partial<Record<ActivityKind, typeof Bell>> = {
  submitted: Inbox,
  approved: FileCheck,
  booked: CalendarCheck,
  uploaded: FileUp,
};

export function NotificationsDrawer() {
  const t = useT();
  const lang = useLang();
  const { state, dispatch } = useStore();
  const unread = unreadActivity(state);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t('topbar.notifications')}
        >
          <Bell size={18} />
          {unread.length > 0 && (
            <span
              aria-hidden
              className="absolute inset-e-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--ddga-color-destructive) px-1 text-[10px] leading-none font-semibold text-(--ddga-color-destructive-foreground)"
            >
              {unread.length > 9 ? '9+' : unread.length.toLocaleString('en-US')}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent side="end">
        <DrawerHeader>
          <DrawerTitle>{t('topbar.notifications')}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {unread.length === 0 ? (
            <EmptyState>
              <EmptyStateMedia>
                <BellOff aria-hidden />
              </EmptyStateMedia>
              <EmptyStateTitle>{t('notif.empty')}</EmptyStateTitle>
              <EmptyStateDescription>{t('notif.emptyDesc')}</EmptyStateDescription>
            </EmptyState>
          ) : (
            <List>
              {unread.map((event) => {
                const Icon = KIND_ICON[event.kind] ?? Bell;
                return (
                  <ListItem key={event.id}>
                    <ListItemIcon>
                      <Icon size={18} aria-hidden />
                    </ListItemIcon>
                    <ListItemContent
                      primary={tField(event.text, lang)}
                      secondary={formatDateTime(event.at)}
                    />
                    <ListItemAction>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t('notif.markOne')}
                        onClick={() => dispatch({ type: 'activity/markRead', ids: [event.id] })}
                      >
                        <Check size={16} />
                      </Button>
                    </ListItemAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DrawerBody>
        <DrawerFooter>
          <Button
            variant="secondary"
            disabled={unread.length === 0}
            onClick={() => dispatch({ type: 'activity/markAllRead' })}
          >
            {t('notif.markAll')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
