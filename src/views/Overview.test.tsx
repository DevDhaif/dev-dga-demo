import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Overview } from './Overview';

// Fixture-pinned values (DEMO_TODAY = 2026-06-10):
// open = 11, urgent open = 3, today's active appointments = 5, completed = 4.
function renderOverview(dir: 'ltr' | 'rtl' = 'ltr') {
  return renderView(<Overview />, { dir, path: '/', route: '/' });
}

describe('Overview', () => {
  it('renders the four KPI values after the fake load', async () => {
    renderOverview();
    const kpisRegion = await screen.findByTestId('kpis');
    expect(await within(kpisRegion).findByText('11')).toBeInTheDocument();
    expect(within(kpisRegion).getByText('3')).toBeInTheDocument();
    expect(within(kpisRegion).getByText('5')).toBeInTheDocument();
    expect(within(kpisRegion).getByText('4')).toBeInTheDocument();
  });

  it('lists pending request ids, newest first', () => {
    renderOverview();
    const pending = within(screen.getByTestId('pending-requests'));
    expect(pending.getByText(/REQ-2026-0128/)).toBeInTheDocument();
    expect(pending.getByText(/REQ-2026-0123/)).toBeInTheDocument();
    // capped at 8 rows
    expect(pending.getAllByRole('listitem')).toHaveLength(8);
  });

  it("shows today's 5 appointments", () => {
    renderOverview();
    const schedule = within(screen.getByTestId('today-schedule'));
    expect(schedule.getAllByRole('listitem')).toHaveLength(5);
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderOverview();
    await within(await screen.findByTestId('kpis')).findByText('11'); // settle past fake loading
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderOverview('rtl');
    await within(await screen.findByTestId('kpis')).findByText('11');
    expect(await axe(container)).toHaveNoViolations();
  });
});
