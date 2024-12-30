import { useEffect } from 'react';
import { AppRouter } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { useAuthStore } from './store/authStore';

function App() {
  const { initialize, subscription } = useAuthStore();

  useEffect(() => {
    initialize();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;