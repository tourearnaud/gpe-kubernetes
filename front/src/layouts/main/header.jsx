import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgBlur } from 'src/theme/css';
import Logo from 'src/components/logo';
import { useAuthContext } from 'src/auth/hooks';
import ChatView from 'src/sections/chat/view/chat-view';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import LoginButton from '../common/login-button';
import HeaderShadow from '../common/header-shadow';
import AccountPopover from '../common/account-popover';
import LanguagePopover from '../common/language-popover';
import SettingsButton from '../common/settings-button';

// import NotificationsPopover from '../common/notifications-popover'

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const { user } = useAuthContext();

  return (
    <>
      <AppBar>
        <Toolbar
          disableGutters
          sx={{
            height: {
              xs: HEADER.H_MOBILE,
              md: HEADER.H_DESKTOP,
            },
            transition: theme.transitions.create(['height'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
            ...(offsetTop && {
              ...bgBlur({
                color: theme.palette.background.default,
              }),
              height: {
                md: HEADER.H_DESKTOP_OFFSET,
              },
            }),
          }}
        >
          <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
            <Logo />

            <Box sx={{ flexGrow: 1 }} />

            {mdUp && <NavDesktop data={navConfig} />}

            <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
              {user ? <AccountPopover /> : <LoginButton />}
              <LanguagePopover />
              {/* <NotificationsPopover /> */}
              <SettingsButton
                sx={{
                  ml: { xs: 1, md: 0 },
                  mr: { md: 2 },
                }}
              />

              {!mdUp && <NavMobile data={navConfig} />}
            </Stack>
          </Container>
        </Toolbar>

        {offsetTop && <HeaderShadow />}
      </AppBar>

      {/* Intégration de ChatView */}
      <ChatView />
    </>
  );
}
