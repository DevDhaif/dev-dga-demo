import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Quote,
  QuoteAuthor,
  QuoteCaption,
  QuoteContent,
  QuoteSource,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import { HELP_TOPICS } from './help/help-topics';
import { TermsModal } from './help/TermsModal';

const BANNER_SRC = '/helpbanner.webp';

export function Help() {
  const t = useT();
  const [topicId, setTopicId] = useState(HELP_TOPICS[0].id);
  const topic = HELP_TOPICS.find((x) => x.id === topicId) ?? HELP_TOPICS[0];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0">{t('help.title')}</h1>

      <Card>
        <CardImage src={BANNER_SRC} alt="" aspectRatio="21/9" className="max-h-40" />
        <CardHeader>
          <CardTitle asChild>
            <h2>{t('help.guides')}</h2>
          </CardTitle>
          <CardDescription>{t('help.guidesDesc')}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Command label={t('help.searchLabel')}>
          <CommandInput placeholder={t('help.searchPlaceholder')} />
          <CommandList>
            <CommandEmpty>{t('palette.empty')}</CommandEmpty>
            <CommandGroup heading={t('help.groupBasics')}>
              {HELP_TOPICS.filter((x) => x.group === 'basics').map((x) => (
                <CommandItem key={x.id} value={t(x.q)} onSelect={() => setTopicId(x.id)}>
                  {t(x.q)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t('help.groupOperations')}>
              {HELP_TOPICS.filter((x) => x.group === 'operations').map((x) => (
                <CommandItem key={x.id} value={t(x.q)} onSelect={() => setTopicId(x.id)}>
                  {t(x.q)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Card variant="outline" data-testid="help-answer">
          <CardHeader>
            <CardTitle asChild>
              <h2>{t(topic.q)}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="m-0">{t(topic.a)}</p>
            <TermsModal />
          </CardContent>
        </Card>
      </div>

      <Quote>
        <QuoteContent>{t('help.quote')}</QuoteContent>
        <QuoteAuthor>{t('help.quoteAuthor')}</QuoteAuthor>
        <QuoteSource>{t('help.quoteSource')}</QuoteSource>
        <QuoteCaption>{t('help.quoteCaption')}</QuoteCaption>
      </Quote>
    </div>
  );
}
