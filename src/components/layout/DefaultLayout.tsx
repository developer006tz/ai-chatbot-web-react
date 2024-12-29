import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DefaultLayoutProps {
  onSignOut: () => void;
}

export function DefaultLayout({ onSignOut }: DefaultLayoutProps) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSignOut={onSignOut} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}