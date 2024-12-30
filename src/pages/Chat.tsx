// src/pages/Chat.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Button } from '../components/shared/Button';
import { PlusCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

export function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user } = useAuthStore();
  const {
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    loadChats,
    setCurrentChat,
    clearCurrentChat,
    initializeRealtimeSubscription
  } = useChatStore();

  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;

      await loadChats();
      initializeRealtimeSubscription();

      if (chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
          setCurrentChat(chat);
        } else {
          navigate('/', { replace: true });
        }
      } else if (chats.length > 0) {
        const latestChat = chats[0]; // Assuming chats are sorted by date
        setCurrentChat(latestChat);
        navigate(`/chat/${latestChat.id}`, { replace: true });
      }
    };

    initializeChat();
  }, [user, chatId]);

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    navigate(`/chat/${newChatId}`);
  };

  const handleNewMessage = async (content: string) => {
    if (!currentChat) {
      const newChatId = await createNewChat();
      navigate(`/chat/${newChatId}`);
    }
    await sendMessage(content);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {currentChat?.title || 'New Chat'}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default"
            onClick={handleNewChat}
            className="text-sm sm:text-base"
          >
            <span className="hidden sm:inline">New Chat</span>
            <PlusCircle size={16} className="sm:ml-1" />
          </Button>
          {currentChat && messages.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCurrentChat}
              disabled={isLoading}
              className="text-sm sm:text-base dark:bg-gray-800 dark:text-gray-100"
            >
              Clear Chat
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
          onSendMessage={handleNewMessage}
        />
      </div>
    </div>
  );
}