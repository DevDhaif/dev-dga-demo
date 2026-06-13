import {
  Button,
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
  Divider,
  RadioGroup,
  Radio,
  Switch,
  toast,
} from '@dev-dga/react';
import { useState } from 'react';
import type { Channel } from '@/data/types';
import { CHANNEL_KEY } from '@/data/labels';
import { useT } from '@/i18n';

const CHANNELS: Channel[] = ['web', 'center', 'phone'];

export function GeneralPanel() {
  const t = useT();
  const [defaultChannel, setDefaultChannel] = useState<Channel>('web');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  return (
    <div className="flex max-w-xl flex-col gap-4" data-testid="general-panel">
      <h2 className="m-0">{t('settings.account')}</h2>
      <DescriptionList divided>
        <DescriptionItem>
          <DescriptionTerm>{t('app.name')}</DescriptionTerm>
          <DescriptionDetails>{t('app.entity')}</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>{t('topbar.profile')}</DescriptionTerm>
          <DescriptionDetails>ops-admin@masar.gov.sa</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>

      <Divider />

      <h2 className="m-0">{t('settings.defaults')}</h2>
      <RadioGroup
        label={t('settings.defaultChannel')}
        value={defaultChannel}
        onValueChange={(v) => setDefaultChannel(v as Channel)}
      >
        {CHANNELS.map((c) => (
          <Radio key={c} value={c} label={t(CHANNEL_KEY[c])} />
        ))}
      </RadioGroup>

      <h2 className="m-0">{t('settings.notifications')}</h2>
      <Switch
        label={t('settings.notify.email')}
        checked={notifyEmail}
        onCheckedChange={setNotifyEmail}
      />
      <Switch label={t('settings.notify.sms')} checked={notifySms} onCheckedChange={setNotifySms} />

      <div>
        <Button variant="primary" onClick={() => toast.success(t('settings.toast.saved'))}>
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
