import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { formatTimestamp } from '../utils/helpers';

export function History() {
  const { chats, loadChats } = useChatStore();

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Chat History</h1>
      
      <div className="space-y-4">
        {chats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No chat history available
          </p>
        ) : (
          chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="block bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                  {formatTimestamp(new Date(chat.created_at).getTime())}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {chat.title}
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-400 line-clamp-2">{chat.title}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
