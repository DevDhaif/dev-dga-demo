import { Tabs, TabsList, TabsTrigger, TabsContent } from '@dev-dga/react';
import { useT } from '@/i18n';
import { GeneralPanel } from './settings/GeneralPanel';
import { TeamPanel } from './settings/TeamPanel';
import { SecurityPanel } from './settings/SecurityPanel';
import { AppearancePanel } from './settings/AppearancePanel';

export function Settings() {
  const t = useT();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0">{t('settings.title')}</h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tab.general')}</TabsTrigger>
          <TabsTrigger value="team">{t('settings.tab.team')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.tab.security')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.tab.appearance')}</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="pt-3">
          <GeneralPanel />
        </TabsContent>
        <TabsContent value="team" className="pt-3">
          <TeamPanel />
        </TabsContent>
        <TabsContent value="security" className="pt-3">
          <SecurityPanel />
        </TabsContent>
        <TabsContent value="appearance" className="pt-3">
          <AppearancePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
