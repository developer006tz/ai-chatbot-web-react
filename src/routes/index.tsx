import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Chat } from '../pages/Chat';
import { Settings } from '../pages/Settings';
import { History } from '../pages/History';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { LayoutWrapper } from './LayoutWrapper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
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
