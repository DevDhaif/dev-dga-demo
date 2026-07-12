import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Divider,
  Textarea,
} from '@dev-dga/react';
import { formatDateTime } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import type { RequestDetailController } from './use-request-detail';

export function CommentsCard({ c }: { c: RequestDetailController }) {
  const t = useT();
  const lang = useLang();
  const [draft, setDraft] = useState('');
  const comments = c.request?.comments ?? [];

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    c.addComment(text);
    setDraft('');
  };

  return (
    <Card variant="outline" data-testid="comments-card">
      <CardHeader>
        <CardTitle asChild>
          <h2>{t('detail.comments')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {comments.length === 0 ? (
          <p className="m-0 text-(--ddga-color-muted-foreground)">{t('detail.noComments')}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {comments.map((comment) => (
              <li key={comment.id} className="flex flex-col gap-1">
                <span className="flex flex-wrap gap-2 text-sm">
                  <strong>{tField(comment.author, lang)}</strong>
                  <span className="text-(--ddga-color-muted-foreground)">
                    {formatDateTime(comment.at)}
                  </span>
                </span>
                <p className="m-0">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
        <Divider />
        <Textarea
          label={t('detail.addComment')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('detail.commentPlaceholder')}
          rows={3}
        />
        <div>
          <Button size="sm" onClick={submit} disabled={!draft.trim()}>
            {t('detail.addComment')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
