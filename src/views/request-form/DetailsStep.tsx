import {
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  RadioGroup,
  Radio,
  DatePicker,
  NumberInput,
  ContentSwitcher,
  ContentSwitcherItem,
  Switch,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TagInput,
  Textarea,
} from '@dev-dga/react';
import type { Channel, Priority } from '@/data/types';
import { services, serviceById } from '@/data/fixtures';
import { CHANNEL_KEY, PRIORITY_KEY } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import { DISTRICTS } from './form-state';
import type { RequestFormController } from './use-request-form';

const CHANNELS: Channel[] = ['web', 'center', 'phone'];
const PRIORITIES: Priority[] = ['low', 'normal', 'high', 'urgent'];

export function DetailsStep({ f }: { f: RequestFormController }) {
  const t = useT();
  const lang = useLang();
  const set = (patch: object) => f.mark(() => f.send({ type: 'set', patch }))();
  const service = f.draft.serviceId ? serviceById(f.draft.serviceId) : undefined;

  return (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Select
        label={t('form.details.service')}
        value={f.draft.serviceId}
        onValueChange={(v) => set({ serviceId: v })}
      >
        {services.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {tField(s.name, lang)}
          </SelectItem>
        ))}
      </Select>
      <Dropdown
        label={t('form.details.district')}
        value={f.draft.district}
        onValueChange={(v) => set({ district: v })}
      >
        {DISTRICTS.map((d) => (
          <DropdownItem key={d.en} value={d.en} keywords={[d.en, d.ar]}>
            {tField(d, lang)}
          </DropdownItem>
        ))}
      </Dropdown>
      {service && (
        <p className="sm:col-span-2 m-0 text-(--ddga-color-muted-foreground)">
          {t('form.fee')}: {t('form.sar', { n: service.fee.toLocaleString('en-US') })} ·{' '}
          {t('form.sla')}: {t('form.days', { n: service.slaDays })}
        </p>
      )}
      <RadioGroup
        label={t('form.details.channel')}
        value={f.draft.channel}
        onValueChange={(v) => set({ channel: v as Channel })}
      >
        {CHANNELS.map((c) => (
          <Radio key={c} value={c} label={t(CHANNEL_KEY[c])} />
        ))}
      </RadioGroup>
      <div className="flex flex-col gap-4">
        <DatePicker
          label={t('form.details.neededBy')}
          value={f.draft.neededBy}
          onChange={(d) => set({ neededBy: d })}
        />
        <NumberInput
          label={t('form.details.quantity')}
          value={f.draft.quantity}
          onValueChange={(v) => set({ quantity: v ?? 1 })}
          min={1}
          max={5}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <ContentSwitcher
          value={f.draft.priority}
          onValueChange={(v) =>
            v && f.mark(() => f.send({ type: 'setPriority', priority: v as Priority }))()
          }
          aria-label={t('form.details.priority')}
        >
          {PRIORITIES.map((p) => (
            <ContentSwitcherItem key={p} value={p}>
              {t(PRIORITY_KEY[p])}
            </ContentSwitcherItem>
          ))}
        </ContentSwitcher>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Switch
                label={t('form.details.urgent')}
                checked={f.draft.urgent}
                onCheckedChange={(c) => f.mark(() => f.send({ type: 'setUrgent', urgent: c }))()}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('form.details.urgentHint')}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <TagInput
          label={t('form.details.tags')}
          value={f.draft.tags}
          onChange={(tags) => set({ tags })}
        />
        <Textarea
          label={t('form.details.notes')}
          value={f.draft.notes}
          onChange={(e) => set({ notes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
