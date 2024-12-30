export const API_CONFIG = {
    baseURL: import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    defaultModel: 'gpt-4o',
    maxTokens: 2000,
    temperature: 0.7,
    systemMessage: "You are a helpful AI assistant that provides clear, accurate, and concise responses."
  } as const;
  
  export const CHAT_CONFIG = {
    maxMessages: 50,
    maxMessageLength: 4000,
    debounceTime: 500,
    typingSpeed: 50,
    streamingEnabled: true
  } as const;
  
  export const LOCAL_STORAGE_KEYS = {
    chatHistory: 'ai_chat_history',
    userSettings: 'ai_user_settings',
    apiKey: 'ai_api_key'
  } as const;
  
  export const ERROR_MESSAGES = {
    apiKeyMissing: 'OpenAI API key is required. Please add it in the settings.',
    networkError: 'Network error occurred. Please check your connection.',
    messageEmpty: 'Message cannot be empty.',
    messageTooLong: `Message cannot exceed ${CHAT_CONFIG.maxMessageLength} characters.`,
    rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
    unauthorized: 'Invalid API key. Please check your settings.'
  } as const;
  