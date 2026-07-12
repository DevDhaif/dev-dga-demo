import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { StaffDirectory } from './StaffDirectory';

const renderStaff = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<StaffDirectory />, { dir, path: '/staff', route: '/staff' });

describe('StaffDirectory', () => {
  it('renders page 1 (6 of 10 members) with pagination', () => {
    renderStaff();
    expect(screen.getAllByTestId('staff-card')).toHaveLength(6);
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
  });

  it('hiding off-shift members leaves the 6 on-shift (single page)', async () => {
    const user = userEvent.setup();
    renderStaff();
    await user.click(screen.getByRole('button', { name: 'Show off-shift' }));
    expect(screen.getAllByTestId('staff-card')).toHaveLength(6);
    expect(screen.queryByRole('link', { name: '2' })).not.toBeInTheDocument();
  });

  it('department filter narrows to the 3 permits members', async () => {
    const user = userEvent.setup();
    renderStaff();
    await user.click(screen.getByLabelText('Department'));
    await user.click(await screen.findByRole('option', { name: 'Permits' }));
    expect(screen.getAllByTestId('staff-card')).toHaveLength(3);
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderStaff();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderStaff('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
