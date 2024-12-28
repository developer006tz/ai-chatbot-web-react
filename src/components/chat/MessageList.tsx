  import { useRef, useEffect } from 'react';
  import { ChatBubble } from './ChatBubble';
import { Message } from '../../types';
  
  interface MessageListProps {
    messages: Message[];
  }
  
  export function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    return (
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    );
  }
  