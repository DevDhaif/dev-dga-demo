import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
  Link,
} from '@dev-dga/react';
import type { StaffMember } from '@/data/types';
import type { StaffWorkload } from '@/store/selectors';
import { staff } from '@/data/fixtures';
import { formatDate } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import { DEPT_KEY } from './staff-keys';

export function AboutPanel({ member, workload }: { member: StaffMember; workload: StaffWorkload }) {
  const t = useT();
  const lang = useLang();

  return (
    <DescriptionList divided data-testid="about-panel">
      <DescriptionItem>
        <DescriptionTerm>{t('profile.role')}</DescriptionTerm>
        <DescriptionDetails>{tField(member.role, lang)}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('profile.department')}</DescriptionTerm>
        <DescriptionDetails>{t(DEPT_KEY[member.department])}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('profile.email')}</DescriptionTerm>
        <DescriptionDetails>
          <Link href={`mailto:${member.email}`}>{member.email}</Link>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('profile.joined')}</DescriptionTerm>
        <DescriptionDetails>{formatDate(member.joinedAt)}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('profile.tab.assignments')}</DescriptionTerm>
        <DescriptionDetails>{workload.total.toLocaleString('en-US')}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('profile.team')}</DescriptionTerm>
        <DescriptionDetails>
          <AvatarGroup size="sm" max={4} data-testid="team-avatars">
            {staff
              .filter((m) => m.department === member.department && m.id !== member.id)
              .map((m) => (
                <Avatar key={m.id}>
                  <AvatarFallback>{m.initials}</AvatarFallback>
                </Avatar>
              ))}
          </AvatarGroup>
        </DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  );
}
