import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@dev-dga/react';
import { NAV, NAV_FOOTER } from './nav';
import { useUiPrefsContext } from './ui-prefs-context';
import { useStore } from '@/store/store-context';
import { services, staff } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';

const ALL_NAV = [...NAV, ...NAV_FOOTER];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const t = useT();
  const lang = useLang();
  const navigate = useNavigate();
  const { state } = useStore();
  const { toggleDir, toggleMode } = useUiPrefsContext();
  const [query, setQuery] = useState('');

  const go = (to: string) => {
    navigate(to);
    onOpenChange(false);
    setQuery('');
  };
  const searching = query.trim().length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} label={t('palette.label')}>
      <CommandInput placeholder={t('palette.placeholder')} value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>{t('palette.empty')}</CommandEmpty>
        <CommandGroup heading={t('palette.pages')}>
          {ALL_NAV.map((item) => (
            <CommandItem
              key={item.path}
              value={item.path}
              keywords={[t(item.labelKey)]}
              onSelect={() => go(item.path)}
            >
              {t(item.labelKey)}
            </CommandItem>
          ))}
        </CommandGroup>
        {searching && (
          <>
            <CommandGroup heading={t('nav.requests')}>
              {state.requests.map((r) => (
                <CommandItem
                  key={r.id}
                  value={`request-${r.id}`}
                  keywords={[r.id, r.applicant.name.en, r.applicant.name.ar]}
                  onSelect={() => go(`/requests/${r.id}`)}
                >
                  {r.id} , {tField(r.applicant.name, lang)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t('nav.staff')}>
              {staff.map((m) => (
                <CommandItem
                  key={m.id}
                  value={`staff-${m.id}`}
                  keywords={[m.name.en, m.name.ar]}
                  onSelect={() => go(`/staff/${m.id}`)}
                >
                  {tField(m.name, lang)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t('nav.services')}>
              {services.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`service-${s.id}`}
                  keywords={[s.name.en, s.name.ar]}
                  onSelect={() => go(`/services/${s.slug}`)}
                >
                  {tField(s.name, lang)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t('nav.documents')}>
              {state.documents.map((d) => (
                <CommandItem
                  key={d.id}
                  value={`document-${d.id}`}
                  keywords={[d.title.en, d.title.ar]}
                  onSelect={() => go('/documents')}
                >
                  {tField(d.title, lang)}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading={t('common.actions')}>
          <CommandItem
            value="action-toggle-theme"
            keywords={[t('topbar.toggleTheme')]}
            onSelect={() => {
              toggleMode();
              onOpenChange(false);
            }}
          >
            {t('topbar.toggleTheme')}
          </CommandItem>
          <CommandItem
            value="action-toggle-lang"
            keywords={[t('topbar.toggleLang')]}
            onSelect={() => {
              toggleDir();
              onOpenChange(false);
            }}
          >
            {t('topbar.toggleLang')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
