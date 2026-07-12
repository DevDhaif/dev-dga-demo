import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tag,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from '@dev-dga/react';
import { AVATAR_SRC } from '@/app/avatar';
import { useAuth } from '@/app/use-auth';
import { useUiPrefsContext } from '@/app/ui-prefs-context';
import { DEMO_TODAY } from '@/data/fixtures';
import { formatDate } from '@/data/labels';
import { useT } from '@/i18n';

export function Profile() {
  const t = useT();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mode, dir, brand } = useUiPrefsContext();

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="m-0">{t('account.title')}</h1>

      <Card variant="elevated">
        <CardContent className="flex items-center gap-4 pt-4">
          <Avatar size="lg">
            <AvatarImage src={AVATAR_SRC} alt="" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <strong className="text-lg">مدير النظام</strong>
            <Tag size="sm" variant="primary-subtle">
              {t('account.roleValue')}
            </Tag>
          </div>
        </CardContent>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle asChild>
            <h2>{t('account.details')}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList divided data-testid="account-details">
            <DescriptionItem>
              <DescriptionTerm>{t('login.username')}</DescriptionTerm>
              <DescriptionDetails dir="ltr">admin</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>{t('account.email')}</DescriptionTerm>
              <DescriptionDetails dir="ltr">admin@masar.sa</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>{t('account.memberSince')}</DescriptionTerm>
              <DescriptionDetails>{formatDate(DEMO_TODAY)}</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>{t('account.preferences')}</DescriptionTerm>
              <DescriptionDetails className="flex flex-wrap gap-2">
                <Tag size="sm" variant="secondary" className="uppercase">
                  {mode}
                </Tag>
                <Tag size="sm" variant="secondary" className="uppercase">
                  {dir}
                </Tag>
                <Tag size="sm" variant="secondary">
                  {t(`brand.${brand}`)}
                </Tag>
              </DescriptionDetails>
            </DescriptionItem>
          </DescriptionList>
        </CardContent>
      </Card>

      <div>
        <Button
          variant="destructive-outline"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          {t('topbar.signOut')}
        </Button>
      </div>
    </div>
  );
}
