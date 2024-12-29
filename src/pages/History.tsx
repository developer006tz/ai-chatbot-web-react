import { useState, useEffect } from 'react';
import { Message } from '../types';
import { loadChatFromLocalStorage } from '../utils/helpers';
import { formatTimestamp } from '../utils/helpers';

interface ChatSession {
  id: string;
  messages: Message[];
  lastMessage: string;
  timestamp: number;
}

export function History() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const messages = loadChatFromLocalStorage();
    
    // Group messages by conversation
    const sessions: ChatSession[] = [];
    let currentSession: Message[] = [];
    let lastTimestamp = 0;

    messages.forEach((message) => {
      // If more than 30 minutes have passed, start a new session
      if (message.timestamp - lastTimestamp > 30 * 60 * 1000) {
        if (currentSession.length > 0) {
          sessions.push({
            id: currentSession[0].id,
            messages: [...currentSession],
            lastMessage: currentSession[currentSession.length - 1].content,
            timestamp: currentSession[currentSession.length - 1].timestamp
          });
        }
        currentSession = [];
      }
      currentSession.push(message);
      lastTimestamp = message.timestamp;
    });

    // Add the last session
    if (currentSession.length > 0) {
      sessions.push({
        id: currentSession[0].id,
        messages: [...currentSession],
        lastMessage: currentSession[currentSession.length - 1].content,
        timestamp: currentSession[currentSession.length - 1].timestamp
      });
    }

    setChatSessions(sessions.reverse());
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Chat History</h1>
      
      <div className="space-y-4">
        {chatSessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No chat history available
          </p>
        ) : (
          chatSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                  {formatTimestamp(session.timestamp)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {session.messages.length} messages
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-400 line-clamp-2">{session.lastMessage}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}