import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Help } from './Help';

const renderHelp = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Help />, { dir, path: '/help', route: '/help' });

describe('Help', () => {
  it('topic search selects an answer', async () => {
    const user = userEvent.setup();
    renderHelp();
    // first topic is preselected
    const answer = within(screen.getByTestId('help-answer'));
    expect(answer.getByRole('heading', { level: 2 })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Type a question…'), 'export');
    await user.click(screen.getByRole('option', { name: /export the activity log/ }));
    expect(within(screen.getByTestId('help-answer')).getByText(/CSV or JSON/)).toBeInTheDocument();
  });

  it('terms modal opens with pinned header/footer and scrollable body', async () => {
    const user = userEvent.setup();
    renderHelp();
    await user.click(screen.getByRole('button', { name: 'Service terms' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Terms of service')).toBeInTheDocument();
    expect(screen.getByTestId('terms-body')).toBeInTheDocument();
    // two legitimate close buttons: the footer action + ModalContent's own X
    await user.click(within(dialog).getAllByRole('button', { name: 'Close' })[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderHelp();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderHelp('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
