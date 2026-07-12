import { CodeSnippet } from '@dev-dga/react';
import { useT } from '@/i18n';

const CURL = `curl https://api.masar.gov.sa/v1/requests \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Accept: application/json"`;

export function ApiSnippet() {
  const t = useT();
  return (
    <section className="flex flex-col gap-2">
      <h2 className="m-0">{t('help.api.title')}</h2>
      <p className="m-0 text-(--ddga-color-muted-foreground)">{t('help.api.desc')}</p>
      <CodeSnippet
        languages={[{ value: 'curl', label: 'cURL', code: CURL }]}
        copyLabel={t('help.api.copy')}
        copiedLabel={t('help.api.copied')}
      />
    </section>
  );
}
