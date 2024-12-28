import { useState, useCallback } from 'react';
import { Message } from '../types';

interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
}

interface UseOpenAIOptions {
  onError?: (error: string) => void;
}

export function useOpenAI({ onError }: UseOpenAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (messages: Message[]) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      const error = 'OpenAI API key is missing';
      onError?.(error);
      throw new Error(error);
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with OpenAI';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  return {
    sendMessage,
    isLoading
  };
}