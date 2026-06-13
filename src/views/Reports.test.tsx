import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Reports } from './Reports';

const renderReports = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Reports />, { dir, path: '/reports', route: '/reports' });

describe('Reports', () => {
  it('renders KPI stats incl. the 71% SLA pinned from fixtures', () => {
    renderReports();
    const stats = within(screen.getByTestId('report-stats'));
    expect(stats.getByText('11')).toBeInTheDocument();
    expect(stats.getByText('71%')).toBeInTheDocument();
  });

  it('status share bars pin the fixture distribution', () => {
    renderReports();
    const share = within(screen.getByTestId('status-share'));
    expect(share.getByText('21.4%')).toBeInTheDocument();
    expect(share.getByText('28.6%')).toBeInTheDocument();
  });

  it('volumes table covers all 8 services', () => {
    renderReports();
    const table = within(screen.getByRole('region', { name: 'Requests by service' }));
    expect(table.getAllByRole('row')).toHaveLength(9);
  });

  it('appointments tab shows the status summary', async () => {
    const user = userEvent.setup();
    renderReports();
    await user.click(screen.getByRole('tab', { name: 'Appointments' }));
    const summary = within(await screen.findByTestId('apt-summary'));
    expect(summary.getByText('10')).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderReports();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderReports('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
