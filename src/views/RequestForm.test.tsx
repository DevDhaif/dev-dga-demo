import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { requests } from '@/data/fixtures';
import { RequestForm } from './RequestForm';

const r0101 = requests.find((r) => r.id === 'REQ-2026-0101')!;

const renderEdit = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<RequestForm />, {
    dir,
    path: '/requests/:id/edit',
    route: '/requests/REQ-2026-0101/edit',
  });

const renderNew = () =>
  renderView(<RequestForm />, { path: '/requests/new', route: '/requests/new' });

describe('RequestForm', () => {
  it('edit mode shows the request id and pre-fills the applicant', () => {
    renderEdit();
    expect(screen.getByText('Request REQ-2026-0101')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveValue(r0101.applicant.name.en);
    expect(screen.getByLabelText(/National ID/)).toHaveValue(r0101.applicant.nationalId);
  });

  it('new mode is blank', () => {
    renderNew();
    expect(screen.getByText('New request')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveValue('');
  });

  it('typing marks the form dirty and shows the unsaved alert', async () => {
    const user = userEvent.setup();
    renderNew();
    await user.type(screen.getByLabelText(/Full name/), 'Test');
    expect(screen.getByText('You have unsaved changes.')).toBeInTheDocument();
  });

  it('next is disabled until the applicant step is valid', async () => {
    const user = userEvent.setup();
    renderNew();
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next).toBeDisabled();
    await user.type(screen.getByLabelText(/Full name/), 'Test Person');
    await user.type(screen.getByLabelText(/National ID/), '1234567890');
    await user.type(screen.getByLabelText(/Mobile number/), '+966512345678');
    expect(next).toBeEnabled();
  });

  it('unknown id shows not-found', () => {
    renderView(<RequestForm />, {
      path: '/requests/:id/edit',
      route: '/requests/REQ-9999-0000/edit',
    });
    expect(screen.getByText('Request not found.')).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderEdit();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderEdit('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
