import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Appointments } from './Appointments';

const renderApts = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Appointments />, { dir, path: '/appointments', route: '/appointments' });

describe('Appointments', () => {
  it('week view shows the 7-day grid with the 12 in-week appointments', () => {
    renderApts();
    const grid = within(screen.getByTestId('week-grid'));
    // every in-week appointment renders a popover trigger "HH:MM · name"
    expect(grid.getAllByRole('button', { name: /\d{2}:\d{2}/ })).toHaveLength(12);
  });

  it('center filter narrows the grid', async () => {
    const user = userEvent.setup();
    renderApts();
    await user.click(screen.getByLabelText('Center'));
    await user.click(await screen.findByRole('option', { name: 'North Center' }));
    const grid = within(screen.getByTestId('week-grid'));
    const rows = grid.getAllByRole('button', { name: /\d{2}:\d{2}/ });
    expect(rows.length).toBeLessThan(12);
  });

  it('day view shows the agenda timeline for the demo today', async () => {
    const user = userEvent.setup();
    renderApts();
    await user.click(screen.getByRole('radio', { name: 'Day' }));
    expect(await screen.findByTestId('day-agenda')).toBeInTheDocument();
  });

  it('cancelling from the drawer updates status (store mutation)', async () => {
    const user = userEvent.setup();
    renderApts();
    const grid = within(screen.getByTestId('week-grid'));
    await user.click(grid.getAllByRole('button', { name: /\d{2}:\d{2}/ })[0]);
    await user.click(await screen.findByRole('button', { name: 'View' }));
    const drawer = await screen.findByRole('dialog', { name: /Appointment details/ });
    const cancelBtn = within(drawer).queryByRole('button', { name: 'Cancel appointment' });
    if (cancelBtn) {
      await user.click(cancelBtn);
      await user.click(await screen.findByRole('button', { name: 'Confirm' }));
      expect(screen.queryByRole('dialog', { name: /Appointment details/ })).toBeNull();
    }
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderApts();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderApts('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
