import type { CSSProperties, ReactNode } from 'react';
import { AspectRatio, Badge } from '@dev-dga/react';
import type { ServiceCategory } from '@/data/types';
import { CATEGORY_KEY, type BadgeVariant } from '@/data/labels';
import { useT } from '@/i18n';

const CATEGORY_BADGE: Record<ServiceCategory, BadgeVariant> = {
  permits: 'info-subtle',
  licenses: 'primary-subtle',
  certificates: 'success-subtle',
  inspections: 'warning-subtle',
};

const bannerStyle: CSSProperties = {
  background:
    'linear-gradient(135deg, var(--ddga-color-muted), color-mix(in oklab, var(--ddga-color-primary) 14%, var(--ddga-color-muted)))',
};

interface CategoryBannerProps {
  category: ServiceCategory;
  ratio: '16/9' | '21/9';
  children?: ReactNode;
}

export function CategoryBanner({ category, ratio, children }: CategoryBannerProps) {
  const t = useT();
  return (
    <AspectRatio ratio={ratio}>
      <div
        className="flex h-full flex-col items-start justify-between gap-2 overflow-hidden rounded-lg p-4"
        style={bannerStyle}
      >
        <Badge variant={CATEGORY_BADGE[category]}>{t(CATEGORY_KEY[category])}</Badge>
        {children}
      </div>
    </AspectRatio>
  );
}
