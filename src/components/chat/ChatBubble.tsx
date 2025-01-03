import { Message } from '../../types';
import { formatTimestamp } from '../../utils/helpers';
import { useTypewriter } from '../../hooks/useTypewriter';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const displayedText = useTypewriter(message.content, 5); 

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 dark:bg-gray-600 text-gray-900'
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap dark:text-white break-words">
            {isUser ? message.content : displayedText}
          </p>
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-indigo-200 ' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}