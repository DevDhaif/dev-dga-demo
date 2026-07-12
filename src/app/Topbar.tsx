import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchBox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Tag,
} from '@dev-dga/react';
import { Moon, Search, Sun } from 'lucide-react';
import { AVATAR_SRC } from './avatar';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import { useAuth } from './use-auth';
import { useUiPrefsContext } from './ui-prefs-context';
import { useT } from '@/i18n';

export function Topbar() {
  const { dir, mode, toggleDir, toggleMode } = useUiPrefsContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <header
      data-slot="app-topbar"
      className="flex items-center gap-2 border-b border-(--ddga-color-border) p-3"
    >
      <div className="hidden max-w-80 min-w-0 flex-1 sm:block">
        <SearchBox
          voiceSearch={false}
          placeholder={t('topbar.searchPlaceholder')}
          aria-label={t('topbar.search')}
          readOnly
          onClick={() => setPaletteOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setPaletteOpen(true);
          }}
          className="cursor-pointer"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setPaletteOpen(true)}
        aria-label={t('topbar.openSearch')}
      >
        <Search size={18} />
      </Button>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <NotificationsDrawer />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMode}
          aria-label={t('topbar.toggleTheme')}
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleDir} aria-label={t('topbar.toggleLang')}>
          <Tag size="sm" variant="secondary">
            {dir === 'rtl' ? 'AR' : 'EN'}
          </Tag>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('topbar.userMenu')}>
              <Avatar size="sm">
                <AvatarImage src={AVATAR_SRC} alt="" />
                <AvatarFallback>NS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              {t('topbar.profile')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              onSelect={() => {
                logout();
                navigate('/login');
              }}
            >
              {t('topbar.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
