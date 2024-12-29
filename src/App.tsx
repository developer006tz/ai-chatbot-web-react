import { ChatProvider } from './context/ChatContext';
import { AppRouter } from './routes';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
    </ThemeProvider>
  );
}

export default App;