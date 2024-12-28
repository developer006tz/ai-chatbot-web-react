
// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { ChatBubbleLeftIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const navigation = [
    { name: 'Chat', to: '/', icon: ChatBubbleLeftIcon },
    { name: 'History', to: '/history', icon: ClockIcon },
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <nav className="w-64 bg-gray-900 text-white p-4">
      <div className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// src/components/layout/Header.tsx
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">AI Chatbot</h1>
      </div>
    </header>
  );
}

// src/components/shared/ErrorBoundary.tsx
import { useRouteError } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

<Button 
  variant="default" 
  size="md" 
  isLoading={loading}
  onClick={handleClick}
>
  Submit
</Button>

<Input
  label="Email"
  type="email"
  id="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
/>

<Loading size="md" text="Loading messages..." />


import { useChat } from '../hooks/useChat';

function ChatComponent() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
      // Handle error in UI
    }
  });

  const handleSubmit = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div>
      {/* Chat interface implementation */}
    </div>
  );
}

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_'
});