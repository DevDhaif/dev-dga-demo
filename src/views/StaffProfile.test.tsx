import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderView } from '@/test/render';
import { staff, requests } from '@/data/fixtures';
import { StaffProfile } from './StaffProfile';

const member = staff[0]; // st-01
const renderProfile = (dir: 'ltr' | 'rtl' = 'ltr', id = member.id) =>
  renderView(<StaffProfile />, { dir, path: '/staff/:id', route: `/staff/${id}` });

describe('StaffProfile', () => {
  it('renders the member header, stats and testimonial', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 1, name: member.name.en })).toBeInTheDocument();
    const stats = within(screen.getByTestId('profile-stats'));
    expect(stats.getByText(member.resolved.toLocaleString('en-US'))).toBeInTheDocument();
    expect(screen.getByText(member.quote.en)).toBeInTheDocument();
  });

  it('assignments tab lists this member’s requests from the store', () => {
    renderProfile();
    const mine = requests.filter((r) => r.assigneeId === member.id);
    const list = within(screen.getByTestId('assignments-list'));
    expect(list.getAllByRole('listitem')).toHaveLength(mine.length);
  });

  it('about tab shows email + department', async () => {
    const user = userEvent.setup();
    renderProfile();
    await user.click(screen.getByRole('tab', { name: 'About' }));
    const about = within(await screen.findByTestId('about-panel'));
    expect(about.getByText(member.email)).toBeInTheDocument();
  });

  it('unknown id shows not-found', () => {
    renderProfile('ltr', 'st-99');
    expect(screen.getByText('Staff member not found.')).toBeInTheDocument();
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
