import { DefaultLayout } from '../components/layout/DefaultLayout';
import { useAuth } from '../hooks/useAuth';

export function LayoutWrapper() {
  const { signOut } = useAuth();
  return <DefaultLayout onSignOut={signOut} />;
}