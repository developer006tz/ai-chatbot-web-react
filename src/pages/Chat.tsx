import { ChatWindow } from '../components/chat/ChatWindow';
import { useEffect } from 'react';
import { Button } from '../components/shared/Button';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { PlusCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore'

export function Chat() {
  const { messages, isLoading, error, sendMessage, clearChat, retryLastMessage } = useChatStore()


  useEffect(() => {
    const apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.apiKey);
    if (!apiKey) {
      console.warn('API key not set. Please configure in settings.');
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Chat</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default"
            onClick={() => window.location.reload()}
            className="text-sm sm:text-base"
          >
            <span className="hidden sm:inline">New Chat</span>
            <PlusCircle size={16} className="sm:ml-1" />
          </Button>
          <Button
            variant="outline"
            onClick={clearChat}
            disabled={messages.length === 0 || isLoading}
            className="text-sm sm:text-base dark:bg-gray-800 dark:text-gray-100"
          >
            Clear Chat
          </Button>
          {error && (
            <Button
              variant="secondary"
              onClick={retryLastMessage}
              disabled={isLoading}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base">
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