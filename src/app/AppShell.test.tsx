import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { AppShell } from './AppShell';

// AppShell is a layout route , render it as one, with a child outlet.
function renderShell(dir: 'ltr' | 'rtl' = 'ltr') {
  return renderView(<AppShell />, { dir, path: '/', route: '/' });
}

describe('AppShell', () => {
  it('renders the sidebar nav + brand (ltr/en)', () => {
    renderShell();
    expect(screen.getByText('Masar')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders Arabic labels in rtl', () => {
    renderShell('rtl');
    expect(screen.getByText('مسار')).toBeInTheDocument();
    expect(screen.getByText('الطلبات')).toBeInTheDocument();
    expect(screen.getByText('الإعدادات')).toBeInTheDocument();
  });

  it('groups the nav with labels, sub-links and a live open-requests badge', () => {
    renderShell();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'In review' })).toHaveAttribute(
      'href',
      '/requests?status=in_review',
    );
    const requestsLink = screen.getByRole('link', { name: /^Requests/ });
    expect(requestsLink.textContent).toMatch(/Requests\d+/);
  });

  it('topbar exposes theme, language and profile controls', () => {
    renderShell();
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle language')).toBeInTheDocument();
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Open search')).toBeInTheDocument();
  });

  it('sets the document title from the active route', () => {
    renderShell();
    expect(document.title).toBe('Overview · Masar');
  });

  it('redirects to /login when not authenticated', () => {
    renderView(<AppShell />, {
      authed: false,
      path: '/',
      route: '/',
      extraRoutes: [{ path: '/login', element: <div data-testid="login-page" /> }],
    });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderShell();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderShell('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
