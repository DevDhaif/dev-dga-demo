import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { Login } from './Login';

const renderLogin = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<Login />, {
    dir,
    authed: false,
    path: '/login',
    route: '/login',
    extraRoutes: [{ path: '/', element: <div data-testid="home" /> }],
  });

describe('Login', () => {
  it('rejects wrong credentials with an error message', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText(/Username/), 'admin');
    await user.type(screen.getByLabelText(/Password/), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    expect(screen.queryByTestId('home')).not.toBeInTheDocument();
  });

  it('signs in with admin/password and navigates home', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText(/Username/), 'admin');
    await user.type(screen.getByLabelText(/Password/), 'password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByTestId('home')).toBeInTheDocument();
  });

  it('has no axe violations (ltr + rtl)', async () => {
    const { container, unmount } = renderLogin();
    expect(await axe(container)).toHaveNoViolations();
    unmount();
    const { container: rtl } = renderLogin('rtl');
    expect(await axe(rtl)).toHaveNoViolations();
  });
});
