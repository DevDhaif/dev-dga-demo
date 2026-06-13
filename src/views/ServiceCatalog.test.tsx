import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { ServiceCatalog } from './ServiceCatalog';

// Pinned from src/data/services.json: 8 services, 2 per category.
function renderCatalog(dir: 'ltr' | 'rtl' = 'ltr') {
  return renderView(<ServiceCatalog />, { dir, path: '/services', route: '/services' });
}

describe('ServiceCatalog', () => {
  it('renders the title and all 8 service cards', () => {
    renderCatalog();
    expect(screen.getByRole('heading', { level: 1, name: 'Service catalog' })).toBeInTheDocument();
    expect(screen.getAllByTestId('service-card')).toHaveLength(8);
    const grid = within(screen.getByTestId('catalog-grid'));
    expect(grid.getByRole('heading', { level: 2, name: 'Building Permit' })).toBeInTheDocument();
    expect(grid.getByText(/612 ratings/)).toBeInTheDocument();
  });

  it('narrows to 2 cards when a category is picked', async () => {
    const user = userEvent.setup();
    renderCatalog();
    await user.click(screen.getByLabelText('Category'));
    await user.click(await screen.findByRole('option', { name: 'Licenses' }));
    const cards = screen.getAllByTestId('service-card');
    expect(cards).toHaveLength(2);
    const grid = within(screen.getByTestId('catalog-grid'));
    expect(grid.getByText('Commercial License')).toBeInTheDocument();
    expect(grid.getByText('Food Truck License')).toBeInTheDocument();
  });

  it('search narrows by name and shows the empty state on no match', async () => {
    const user = userEvent.setup();
    renderCatalog();
    const search = screen.getByRole('searchbox', { name: 'Search services…' });
    await user.type(search, 'health');
    expect(screen.getAllByTestId('service-card')).toHaveLength(1);
    expect(screen.getByText('Health Certificate')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'zzz-no-such-service');
    expect(screen.queryAllByTestId('service-card')).toHaveLength(0);
    expect(screen.getByText('No matching services.')).toBeInTheDocument();
  });

  it('searches Arabic names in rtl', async () => {
    const user = userEvent.setup();
    renderCatalog('rtl');
    await user.type(screen.getByRole('searchbox'), 'تصريح');
    expect(screen.getAllByTestId('service-card')).toHaveLength(2);
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderCatalog();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderCatalog('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
