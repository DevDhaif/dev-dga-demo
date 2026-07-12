import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { staff } from '@/data/fixtures';
import { Settings } from './Settings';

const renderSettings = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Settings />, { dir, path: '/settings', route: '/settings' });

describe('Settings', () => {
  it('general tab: account summary + default channel radios', () => {
    renderSettings();
    const panel = within(screen.getByTestId('general-panel'));
    expect(panel.getByText('Municipal Services Agency')).toBeInTheDocument();
    expect(panel.getByRole('radio', { name: 'Web' })).toBeChecked();
  });

  it('team tab lists all 10 staff rows', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByRole('tab', { name: 'Team' }));
    const region = within(await screen.findByRole('region', { name: 'Team members' }));
    expect(region.getAllByRole('row')).toHaveLength(staff.length + 1);
  });

  it('security tab: enabling 2FA reveals the OTP field; completing it shows the badge', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByRole('tab', { name: 'Security' }));
    const panel = within(await screen.findByTestId('security-panel'));
    await user.click(panel.getByRole('switch'));
    const otp = panel.getByLabelText('Verification code');
    await user.type(otp, '123456');
    expect(await panel.findByText('Two-factor enabled')).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderSettings();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderSettings('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
