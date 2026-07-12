import {
  Button,
  SlideoutMenu,
  SlideoutMenuTrigger,
  SlideoutMenuContent,
  SlideoutMenuHeader,
  SlideoutMenuTitle,
  SlideoutMenuBody,
  SlideoutMenuGroup,
  SlideoutMenuItem,
  SlideoutMenuClose,
} from '@dev-dga/react';
import { HELP_TOPICS } from './help-topics';
import { useT } from '@/i18n';

export function TopicsMenu({ onSelectTopic }: { onSelectTopic: (id: string) => void }) {
  const t = useT();
  return (
    <SlideoutMenu>
      <SlideoutMenuTrigger asChild>
        <Button variant="secondary">{t('help.browseTopics')}</Button>
      </SlideoutMenuTrigger>
      <SlideoutMenuContent aria-label={t('help.browseTopics')}>
        <SlideoutMenuHeader>
          <SlideoutMenuTitle>{t('help.browseTopics')}</SlideoutMenuTitle>
        </SlideoutMenuHeader>
        <SlideoutMenuBody>
          <SlideoutMenuGroup>
            {HELP_TOPICS.map((x) => (
              <SlideoutMenuClose asChild key={x.id}>
                <SlideoutMenuItem onClick={() => onSelectTopic(x.id)}>{t(x.q)}</SlideoutMenuItem>
              </SlideoutMenuClose>
            ))}
          </SlideoutMenuGroup>
        </SlideoutMenuBody>
      </SlideoutMenuContent>
    </SlideoutMenu>
  );
}
