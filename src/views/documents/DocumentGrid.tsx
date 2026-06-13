import {
  AspectRatio,
  Badge,
  Card,
  CardContent,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@dev-dga/react';
import { FileText, Image as ImageIcon, Table2 } from 'lucide-react';
import type { DocumentAsset, DocumentKind } from '@/data/types';
import { staffById } from '@/data/fixtures';
import { DOCKIND_KEY, formatDate, formatSizeKB } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import { zoomCols } from './documents-logic';
import type { DocumentsController } from './use-documents';

const KIND_ICON: Record<DocumentKind, typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  sheet: Table2,
};

const KIND_STYLE: Record<DocumentKind, string> = {
  pdf: 'text-(--ddga-color-error) bg-[color-mix(in_oklab,var(--ddga-color-error)_9%,var(--ddga-color-muted))]',
  image:
    'text-(--ddga-color-info) bg-[color-mix(in_oklab,var(--ddga-color-info)_9%,var(--ddga-color-muted))]',
  sheet:
    'text-(--ddga-color-success) bg-[color-mix(in_oklab,var(--ddga-color-success)_9%,var(--ddga-color-muted))]',
};

export function DocumentGrid({ d }: { d: DocumentsController }) {
  const t = useT();
  const lang = useLang();

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${zoomCols(d.zoom)}`}
      data-testid="doc-grid"
    >
      {d.rows.map((doc) => {
        const Icon = KIND_ICON[doc.kind];
        return (
          <Card key={doc.id} variant="outline">
            <CardContent className="flex flex-col gap-2 p-2">
              <AspectRatio
                ratio="4/3"
                className={`flex items-center justify-center rounded-md ${KIND_STYLE[doc.kind]}`}
              >
                <Icon size={32} aria-hidden />
              </AspectRatio>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => d.setSelected(doc)}
              >
                <span className="truncate">{tField(doc.title, lang)}</span>
              </Button>
              <div className="flex items-center justify-between gap-2">
                <Badge size="sm" variant="secondary-subtle">
                  {t(DOCKIND_KEY[doc.kind])}
                </Badge>
                <QuickInfo doc={doc} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function QuickInfo({ doc }: { doc: DocumentAsset }) {
  const t = useT();
  const lang = useLang();
  const uploader = staffById(doc.uploadedBy);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          {formatSizeKB(doc.sizeKB)}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={t('docs.quickInfo')}>
        <div className="flex flex-col gap-1">
          <strong>{tField(doc.title, lang)}</strong>
          <span>
            {t('docs.uploadedBy')}: {uploader ? tField(uploader.name, lang) : doc.uploadedBy}
          </span>
          <span>
            {t('docs.uploadedAt')}: {formatDate(doc.uploadedAt)}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
