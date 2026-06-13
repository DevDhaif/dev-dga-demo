import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Profile } from './Profile';

const renderProfile = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Profile />, {
    dir,
    path: '/profile',
    route: '/profile',
    extraRoutes: [{ path: '/login', element: <div data-testid="login-page" /> }],
  });

describe('Profile', () => {
  it('shows account details and a sign-out action', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 1, name: 'My profile' })).toBeInTheDocument();
    const details = within(screen.getByTestId('account-details'));
    expect(details.getByText('admin@masar.sa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderProfile();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderProfile('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
