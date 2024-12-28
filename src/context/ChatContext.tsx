import { createContext, useReducer, useCallback, ReactNode } from 'react';
import { chatReducer } from './chatReducer';
import { ChatContextType, ChatState } from './chatState';
import { generateMessageId, loadChatFromLocalStorage } from '../utils/helpers';
import { Message } from '../types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const initialState: ChatState = {
  messages: loadChatFromLocalStorage(),
  isLoading: false,
  error: null,
  currentConversationId: null,
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !OPENAI_API_KEY) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: !OPENAI_API_KEY ? 'API key is missing' : 'Message cannot be empty' 
      });
      return;
    }

    const userMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      role: 'user',
      timestamp: Date.now(),
    };

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            ...state.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from AI';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...state.messages]
      .reverse()
      .find(message => message.role === 'user');

    if (lastUserMessage && !state.isLoading) {
      dispatch({ type: 'SET_ERROR', payload: null });
      await sendMessage(lastUserMessage.content);
    }
  }, [state.messages, state.isLoading, sendMessage]);

  const value = {
    ...state,
    sendMessage,
    clearChat,
    retryLastMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}