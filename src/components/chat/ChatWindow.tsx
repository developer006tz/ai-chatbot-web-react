import { Message } from '../../types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<void>;
}

export function ChatWindow({ messages, isLoading, onSendMessage }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Start a conversation by sending a message.</p>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}