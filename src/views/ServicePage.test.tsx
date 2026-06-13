import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { ServicePage } from './ServicePage';

// Pinned from src/data/services.json -> building-permit:
// fee 500, slaDays 14, rating 4.3, 4 steps, 3 FAQ items.
function renderPage(slug: string, dir: 'ltr' | 'rtl' = 'ltr') {
  return renderView(<ServicePage />, {
    dir,
    path: '/services/:slug',
    route: `/services/${slug}`,
  });
}

describe('ServicePage', () => {
  it('renders name, summary, facts, steps, and FAQ for a real slug', () => {
    renderPage('building-permit');
    expect(
      within(screen.getByTestId('service-title')).getByText('Building Permit'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Apply for a permit to construct/)).toBeInTheDocument();

    const facts = within(screen.getByTestId('service-facts'));
    expect(facts.getByText('500 SAR')).toBeInTheDocument();
    expect(facts.getByText('14 days')).toBeInTheDocument();
    expect(facts.getByRole('img', { name: '4.3 out of 5 stars' })).toBeInTheDocument();

    const steps = within(screen.getByTestId('service-steps'));
    expect(steps.getAllByRole('listitem')).toHaveLength(4);
    expect(steps.getByText(/Verify eligibility and prepare the land deed/)).toBeInTheDocument();

    const faq = within(screen.getByTestId('service-faq'));
    expect(faq.getAllByRole('button')).toHaveLength(3);
    expect(faq.getByText('How long is the building permit valid?')).toBeInTheDocument();

    // related: same-category sibling first, current excluded
    const related = within(screen.getByTestId('related-services'));
    expect(related.getByText('Demolition Permit')).toBeInTheDocument();
    expect(related.queryByText('Building Permit')).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Start request' })).toHaveAttribute(
      'href',
      '/requests/new',
    );
  });

  it('renders Arabic content in rtl', () => {
    renderPage('building-permit', 'rtl');
    expect(within(screen.getByTestId('service-title')).getByText('تصريح بناء')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('service-faq')).getByText('ما مدة صلاحية تصريح البناء؟'),
    ).toBeInTheDocument();
  });

  it('shows the not-found empty state with a back link for an unknown slug', () => {
    renderPage('no-such-service');
    expect(screen.getByText('Service not found.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Service catalog' })).toHaveAttribute(
      'href',
      '/services',
    );
    expect(screen.queryByTestId('service-facts')).not.toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderPage('building-permit');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderPage('building-permit', 'rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
