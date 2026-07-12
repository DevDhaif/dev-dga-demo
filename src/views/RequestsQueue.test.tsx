import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { RequestsQueue } from './RequestsQueue';

function renderQueue(dir: 'ltr' | 'rtl' = 'ltr') {
  return renderView(<RequestsQueue />, { dir, path: '/requests', route: '/requests' });
}

async function findTable() {
  return within(await screen.findByRole('table'));
}

describe('RequestsQueue', () => {
  it('renders 10 rows on page 1 of 28 fixtures', async () => {
    renderQueue();
    const table = await findTable();
    // 1 header row + 10 data rows
    expect(table.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByText('REQ-2026-0128')).toBeInTheDocument();
  });

  it('search narrows to a single row', async () => {
    const user = userEvent.setup();
    renderQueue();
    await screen.findByRole('table');
    await user.type(screen.getByPlaceholderText('Search requests…'), 'REQ-2026-0101');
    const table = await findTable();
    expect(table.getAllByRole('row')).toHaveLength(2);
    expect(table.getByText('REQ-2026-0101')).toBeInTheDocument();
  });

  it('status tab New narrows to the 6 new requests', async () => {
    const user = userEvent.setup();
    renderQueue();
    await screen.findByRole('table');
    await user.click(screen.getByRole('tab', { name: 'New' }));
    const table = await findTable();
    expect(table.getAllByRole('row')).toHaveLength(7);
  });

  it('bulk select + approve mutates the store (badge updates, bar clears)', async () => {
    const user = userEvent.setup();
    renderQueue();
    const table = await findTable();
    // REQ-2026-0128 is newest-first row; its row checkbox is labeled by id
    await user.click(table.getByRole('checkbox', { name: 'REQ-2026-0128' }));
    const bar = screen.getByTestId('bulk-bar');
    expect(within(bar).getByText('1 selected')).toBeInTheDocument();
    await user.click(within(bar).getByRole('button', { name: 'Approve selected' }));
    // selection cleared -> bar gone; row now shows the Approved badge
    expect(screen.queryByTestId('bulk-bar')).not.toBeInTheDocument();
    const row = screen.getByText('REQ-2026-0128').closest('tr')!;
    expect(within(row).getByText('Approved')).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderQueue();
    await screen.findByRole('table');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderQueue('rtl');
    await screen.findByRole('table');
    expect(await axe(container)).toHaveNoViolations();
  });
});
