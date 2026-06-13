import { useState } from 'react';
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Divider,
  FieldMessage,
  InputOTP,
  Switch,
  toast,
} from '@dev-dga/react';
import { useT } from '@/i18n';

export function SecurityPanel() {
  const t = useT();
  const [twoFa, setTwoFa] = useState(false);
  const [otp, setOtp] = useState('');
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex max-w-xl flex-col gap-4" data-testid="security-panel">
      <h2 className="m-0">{t('settings.2fa')}</h2>
      <Switch label={t('settings.2fa')} checked={twoFa} onCheckedChange={setTwoFa} />
      {twoFa && !enabled && (
        <div className="flex flex-col gap-3">
          <InputOTP
            length={6}
            label={t('form.applicant.otpLabel')}
            helperText={t('settings.2faHelp')}
            value={otp}
            onChange={setOtp}
            onComplete={() => {
              setEnabled(true);
              toast.success(t('settings.2faEnabled'));
            }}
          />
        </div>
      )}
      {enabled && <Badge variant="success">{t('settings.2faEnabled')}</Badge>}

      <Divider />

      <Collapsible>
        <CollapsibleTrigger>{t('settings.danger')}</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3 pt-2">
            <FieldMessage id="danger-help" variant="helper">
              {t('settings.dangerHelp')}
            </FieldMessage>
            <div>
              <Button variant="destructive" onClick={() => window.location.reload()}>
                {t('settings.resetData')}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
