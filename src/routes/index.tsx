import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DefaultLayout } from '../components/layout/DefaultLayout';
import { Chat } from '../pages/Chat';
import { Settings } from '../pages/Settings';
import { History } from '../pages/History';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
