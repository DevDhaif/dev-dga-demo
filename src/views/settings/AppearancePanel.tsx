import { useState } from 'react';
import { Switch, Toggle, ToggleGroup, ToggleGroupItem } from '@dev-dga/react';
import { useUiPrefsContext } from '@/app/ui-prefs-context';
import { BRANDS, type Brand } from '@/app/use-ui-prefs';
import { useT, type I18nKey } from '@/i18n';

const BRAND_LABEL: Record<Brand, I18nKey> = {
  saGreen: 'brand.saGreen',
  gold: 'brand.gold',
  lavender: 'brand.lavender',
  info: 'brand.info',
};

const BRAND_DOT: Record<Brand, string> = {
  saGreen: 'bg-(--ddga-sa-500)',
  gold: 'bg-(--ddga-gold-500)',
  lavender: 'bg-(--ddga-lavender-500)',
  info: 'bg-(--ddga-info-500)',
};

export function AppearancePanel() {
  const t = useT();
  const { dir, mode, brand, toggleDir, toggleMode, setBrand } = useUiPrefsContext();
  const [compact, setCompact] = useState(false);

  return (
    <div className="flex max-w-xl flex-col gap-4" data-testid="appearance-panel">
      <Switch
        label={t('topbar.toggleTheme')}
        checked={mode === 'dark'}
        onCheckedChange={toggleMode}
      />
      <Switch label={t('topbar.toggleLang')} checked={dir === 'rtl'} onCheckedChange={toggleDir} />
      <div className="flex flex-col gap-2">
        <span id="brand-label">{t('settings.brand')}</span>
        <ToggleGroup
          type="single"
          value={brand}
          onValueChange={(v) => v && setBrand(v as Brand)}
          aria-labelledby="brand-label"
        >
          {BRANDS.map((b) => (
            <ToggleGroupItem key={b} value={b}>
              <span aria-hidden className={`inline-block h-3 w-3 rounded-full ${BRAND_DOT[b]}`} />
              {t(BRAND_LABEL[b])}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div>
        <Toggle pressed={compact} onPressedChange={setCompact}>
          {t('settings.compact')}
        </Toggle>
      </div>
    </div>
  );
}
