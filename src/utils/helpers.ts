import { LOCAL_STORAGE_KEYS } from "./constants";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function saveChatToLocalStorage(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.chatHistory, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export function loadChatFromLocalStorage(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.chatHistory);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

export function validateApiKey(apiKey: string): boolean {
  return /^sk-[a-zA-Z0-9]{32,}$/.test(apiKey);
}

export async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}