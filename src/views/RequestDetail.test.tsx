import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { RequestDetail } from './RequestDetail';

const renderDetail = (id = 'REQ-2026-0101', dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<RequestDetail />, { dir, path: '/requests/:id', route: `/requests/${id}` });

describe('RequestDetail', () => {
  it('shows the request header, info panel and empty comments', () => {
    renderDetail();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('REQ-2026-0101');
    const info = within(screen.getByTestId('request-info'));
    expect(info.getByText('National ID')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('comments-card')).getByText(/No comments yet/),
    ).toBeInTheDocument();
  });

  it('approve flips the status badge', async () => {
    const user = userEvent.setup();
    renderDetail('REQ-2026-0120');
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(
      within(screen.getByRole('heading', { level: 1 })).getByText('Approved'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
  });

  it('adds a comment to the thread', async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.type(screen.getByLabelText('Add comment'), 'Documents verified.');
    await user.click(screen.getByRole('button', { name: 'Add comment' }));
    expect(screen.getByText('Documents verified.')).toBeInTheDocument();
    expect(screen.queryByText(/No comments yet/)).not.toBeInTheDocument();
  });

  it('unknown id shows the not-found empty state', () => {
    renderDetail('REQ-0000-9999');
    expect(screen.getByTestId('request-missing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to queue' })).toHaveAttribute(
      'href',
      '/requests',
    );
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderDetail();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderDetail('REQ-2026-0101', 'rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
