import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import MainLayout from 'src/layouts/main';
import { AuthGuard } from 'src/auth/guard';
import CompactLayout from 'src/layouts/compact';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const ProfilePage = lazy(() => import('src/pages/profile'));
const LieuPage = lazy(() => import('src/pages/lieu'));
const UserPage = lazy(() => import('src/pages/user'));
const MapPage = lazy(() => import('src/pages/map'));
const ChatPage = lazy(() => import('src/pages/chat')); // Import de la page Chat

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      {
        path: 'profile',
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
        index: true,
      },
      {
        path: 'lieu',
        element: (
          <AuthGuard>
            <LieuPage />
          </AuthGuard>
        ),
        index: true,
      },
      {
        path: 'user',
        element: (
          <AuthGuard>
            <UserPage />
          </AuthGuard>
        ),
        index: true,
      },
      {
        path: 'map',
        element: <MapPage />,
        index: true,
      },
      {
        path: 'chat', // Route pour la page Chat
        element: (
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        ),
        index: true,
      },
    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
