import type { I18nKey } from '@/i18n';

export interface HelpTopic {
  id: string;
  q: I18nKey;
  a: I18nKey;
  group: 'basics' | 'operations';
}

export const HELP_TOPICS: HelpTopic[] = [
  { id: 'theme', q: 'help.q.theme', a: 'help.a.theme', group: 'basics' },
  { id: 'language', q: 'help.q.language', a: 'help.a.language', group: 'basics' },
  { id: 'requests', q: 'help.q.requests', a: 'help.a.requests', group: 'operations' },
  { id: 'export', q: 'help.q.export', a: 'help.a.export', group: 'operations' },
];
