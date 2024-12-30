import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Chat } from '../pages/Chat';
import { Settings } from '../pages/Settings';
import { History } from '../pages/History';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { LayoutWrapper } from './LayoutWrapper';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LayoutWrapper />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: 'chat/:chatId',
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