import { ChatProvider } from './context/ChatContext';
import { AppRouter } from './routes';

function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}

export default App;