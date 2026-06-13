import { useState } from 'react';
import { Input, InputOTP, Button, Badge } from '@dev-dga/react';
import { useT } from '@/i18n';
import { isValidNationalId, isValidPhone } from './form-state';
import type { RequestFormController } from './use-request-form';

export function ApplicantStep({ f }: { f: RequestFormController }) {
  const t = useT();
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const set = (patch: object) => f.mark(() => f.send({ type: 'set', patch }))();

  const nationalIdInvalid =
    f.draft.nationalId.trim() !== '' && !isValidNationalId(f.draft.nationalId);
  const phoneInvalid = f.draft.phone.trim() !== '' && !isValidPhone(f.draft.phone);

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Input
        label={t('form.applicant.name')}
        value={f.draft.name}
        onChange={(e) => set({ name: e.target.value })}
        required
      />
      <Input
        label={t('form.applicant.nationalId')}
        value={f.draft.nationalId}
        onChange={(e) => set({ nationalId: e.target.value })}
        required
        inputMode="numeric"
        helperText={t('form.applicant.nationalIdHelp')}
        error={nationalIdInvalid}
        errorMessage={nationalIdInvalid ? t('form.applicant.nationalIdError') : undefined}
      />
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <Input
            label={t('form.applicant.phone')}
            value={f.draft.phone}
            onChange={(e) => set({ phone: e.target.value })}
            required
            inputMode="tel"
            error={phoneInvalid}
            errorMessage={phoneInvalid ? t('form.applicant.phoneError') : undefined}
          />
        </div>
        {f.draft.verified ? (
          <Badge variant="success" className="shrink-0">
            {t('form.applicant.verified')}
          </Badge>
        ) : (
          <Button variant="secondary" className="shrink-0" onClick={() => setOtpOpen(true)}>
            {t('form.applicant.verify')}
          </Button>
        )}
      </div>
      {otpOpen && !f.draft.verified && (
        <InputOTP
          length={6}
          label={t('form.applicant.otpLabel')}
          helperText={t('form.applicant.otpHelp')}
          value={otp}
          onChange={setOtp}
          onComplete={() => {
            set({ verified: true });
            setOtpOpen(false);
          }}
        />
      )}
    </div>
  );
}
