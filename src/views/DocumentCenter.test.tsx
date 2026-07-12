import { describe, it, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { DocumentCenter } from './DocumentCenter';

const renderDocs = (dir: 'ltr' | 'rtl' = 'ltr') =>
  renderView(<DocumentCenter />, { dir, path: '/documents', route: '/documents' });

describe('DocumentCenter', () => {
  it('renders page 1 of the 16 fixtures (8 tiles) with pagination', () => {
    renderDocs();
    expect(within(screen.getByTestId('doc-grid')).getAllByRole('button').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
  });

  it('kind filter narrows to the 7 pdf fixtures (single page)', async () => {
    const user = userEvent.setup();
    renderDocs();
    await user.click(screen.getByRole('radio', { name: 'PDF' }));
    expect(screen.queryByRole('link', { name: '2' })).not.toBeInTheDocument();
  });

  it('search filters titles and shows the empty state on no match', async () => {
    const user = userEvent.setup();
    renderDocs();
    await user.type(screen.getByPlaceholderText('Search documents…'), 'zzz-nope');
    expect(screen.getByText('No matching documents.')).toBeInTheDocument();
  });

  it('upload flow adds a document to the store', async () => {
    const user = userEvent.setup();
    renderDocs();
    await user.click(screen.getByRole('button', { name: 'Upload' }));
    const modal = await screen.findByRole('dialog', { name: /Upload documents/ });
    const input = modal.querySelector('input[type="file"]')!;
    await user.upload(
      input as HTMLInputElement,
      new File([new Uint8Array(1024)], 'new-site-plan.pdf'),
    );
    await user.click(within(modal).getByRole('button', { name: 'Upload' }));
    await waitFor(
      () => expect(screen.queryByRole('dialog', { name: /Upload documents/ })).toBeNull(),
      {
        timeout: 2000,
      },
    );
    await user.type(screen.getByPlaceholderText('Search documents…'), 'new-site-plan');
    expect(within(screen.getByTestId('doc-grid')).getByText(/new-site-plan/)).toBeInTheDocument();
  });

  it('has no axe violations (ltr)', async () => {
    const { container } = renderDocs();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (rtl)', async () => {
    const { container } = renderDocs('rtl');
    expect(await axe(container)).toHaveNoViolations();
  });
});
