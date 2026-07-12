import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { NotFound } from './NotFound';

const renderNotFound = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<NotFound />, { dir, path: '*', route: '/no-such-page' });

describe('NotFound', () => {
  it('offers a way back home', () => {
    renderNotFound();
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to overview' })).toHaveAttribute('href', '/');
  });

  it('has no axe violations (ltr + rtl)', async () => {
    const { container, unmount } = renderNotFound();
    expect(await axe(container)).toHaveNoViolations();
    unmount();
    const { container: rtl } = renderNotFound('rtl');
    expect(await axe(rtl)).toHaveNoViolations();
  });
});
