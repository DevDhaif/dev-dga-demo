import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { NotificationsDrawer } from './NotificationsDrawer';

describe('NotificationsDrawer', () => {
  it('shows unread activity and marks all read', async () => {
    const user = userEvent.setup();
    renderView(<NotificationsDrawer />);

    const trigger = screen.getByRole('button', { name: 'Notifications' });
    expect(trigger.textContent).toMatch(/\d+/);

    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(screen.getByText('All caught up')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeDisabled();
  });

  it('marks a single item read', async () => {
    const user = userEvent.setup();
    renderView(<NotificationsDrawer />);
    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    const before = screen.getAllByRole('button', { name: 'Mark as read' }).length;
    await user.click(screen.getAllByRole('button', { name: 'Mark as read' })[0]);
    const after = screen.queryAllByRole('button', { name: 'Mark as read' }).length;
    expect(after).toBe(before - 1);
  });

  it('open drawer has no axe violations (rtl)', async () => {
    const user = userEvent.setup();
    const { baseElement } = renderView(<NotificationsDrawer />, { dir: 'rtl' });
    await user.click(screen.getByRole('button', { name: 'الإشعارات' }));
    await screen.findByRole('dialog');
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
