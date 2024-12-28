import { useChat } from '../hooks/useChat';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useEffect } from 'react';
import { Button } from '../components/shared/Button';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export function Chat() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useChat({
    onError: (error) => {
      // You could implement a toast notification here
      console.error('Chat error:', error);
    }
  });

  useEffect(() => {
    // Check if API key is set
    const apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.apiKey);
    if (!apiKey) {
      // You could implement a redirect or modal here
      console.warn('API key not set. Please configure in settings.');
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={clearChat}
            disabled={messages.length === 0 || isLoading}
          >
            Clear Chat
          </Button>
          {error && (
            <Button
              variant="secondary"
              onClick={retryLastMessage}
              disabled={isLoading}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}