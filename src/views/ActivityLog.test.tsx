import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { ActivityLog } from './ActivityLog';

const renderLog = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<ActivityLog />, { dir, path: '/activity', route: '/activity' });

describe('ActivityLog', () => {
  it('renders the audit table with footer total and ellipsis pagination', () => {
    const { container } = renderLog();
    const table = within(screen.getByTestId('activity-table'));
    expect(table.getByText('72 events')).toBeInTheDocument();
    // 72 rows / 9 per page = 8 pages -> window collapses with ellipsis markers
    expect(container.querySelectorAll('[data-slot="pagination-ellipsis"]').length).toBeGreaterThan(
      0,
    );
    expect(screen.getByRole('link', { name: '8' })).toBeInTheDocument();
  });

  it('module filter narrows the footer total', async () => {
    const user = userEvent.setup();
    renderLog();
    await user.click(screen.getByRole('button', { name: 'Module' }));
    await user.click(await screen.findByRole('option', { name: 'Documents' }));
    const table = within(screen.getByTestId('activity-table'));
    expect(table.getByText(/^1[0-9] events$/)).toBeInTheDocument();
  });

  it('view menubar hides the Reference column', async () => {
    const user = userEvent.setup();
    renderLog();
    expect(screen.getByRole('columnheader', { name: 'Reference' })).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'View' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Reference' }));
    expect(screen.queryByRole('columnheader', { name: 'Reference' })).not.toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderLog();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderLog('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
