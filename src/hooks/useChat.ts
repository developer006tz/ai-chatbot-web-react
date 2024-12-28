import { useCallback, useState } from 'react';
import { Message } from '../types';
import { useOpenAI } from './useOpenAI';
import { generateMessageId } from '../utils/helpers';

interface UseChatOptions {
  initialMessages?: Message[];
  onError?: (error: string) => void;
}

export function useChat({ initialMessages = [], onError }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const { sendMessage: sendToOpenAI, isLoading } = useOpenAI({
    onError: (errorMessage) => {
      setError(errorMessage);
      onError?.(errorMessage);
    }
  });

  const addMessage = useCallback((content: string, role: Message['role']) => {
    const newMessage: Message = {
      id: generateMessageId(),
      content,
      role,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      const errorMessage = 'Message cannot be empty';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setError(null);
    const userMessage = addMessage(content, 'user');

    try {
      const aiResponse = await sendToOpenAI([
        {
          id: 'system',
          role: 'system',
          content: 'You are a helpful AI assistant.',
          timestamp: Date.now()
        },
        ...messages,
        userMessage
      ]);

      addMessage(aiResponse, 'assistant');
    } catch (error) {
      // Error handling is managed by useOpenAI hook
      console.error(error);
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    }
  }, [messages, addMessage, sendToOpenAI, onError]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(message => message.role === 'user');

    if (lastUserMessage && !isLoading) {
      const lastMessageIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      // Remove messages after the last user message
      setMessages(messages.slice(0, lastMessageIndex));
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, isLoading, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    retryLastMessage
  };
}