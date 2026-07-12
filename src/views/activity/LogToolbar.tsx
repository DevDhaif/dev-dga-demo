import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  toast,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import type { LogView } from './log-view';

export function LogToolbar({
  view,
  onChange,
}: {
  view: LogView;
  onChange: (patch: Partial<LogView>) => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-56">
        <Dropdown
          label={t('activity.colModule')}
          value={view.module}
          onValueChange={(v) => onChange({ module: v as LogView['module'] })}
        >
          <DropdownItem value="all">{t('common.all')}</DropdownItem>
          <DropdownSeparator />
          <DropdownGroup heading={t('activity.modules')}>
            <DropdownItem value="requests">{t('nav.requests')}</DropdownItem>
            <DropdownItem value="appointments">{t('nav.appointments')}</DropdownItem>
            <DropdownItem value="documents">{t('nav.documents')}</DropdownItem>
          </DropdownGroup>
        </Dropdown>
      </div>

      <Menubar>
        <MenubarMenu value="view">
          <MenubarTrigger>{t('common.view')}</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>{t('activity.columns')}</MenubarLabel>
            <MenubarCheckboxItem
              checked={view.cols.module}
              onCheckedChange={(c) => onChange({ cols: { ...view.cols, module: c === true } })}
            >
              {t('activity.colModule')}
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={view.cols.ref}
              onCheckedChange={(c) => onChange({ cols: { ...view.cols, ref: c === true } })}
            >
              {t('activity.colRef')}
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>{t('activity.density')}</MenubarLabel>
            <MenubarRadioGroup
              value={view.density}
              onValueChange={(v) => onChange({ density: v as LogView['density'] })}
            >
              <MenubarRadioItem value="md">{t('activity.densityComfortable')}</MenubarRadioItem>
              <MenubarRadioItem value="sm">{t('activity.densityCompact')}</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>{t('activity.export')}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onSelect={() => toast.success(t('activity.exported'))}>
                  CSV
                </MenubarItem>
                <MenubarItem onSelect={() => toast.success(t('activity.exported'))}>
                  JSON
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
