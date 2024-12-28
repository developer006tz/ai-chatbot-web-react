import { ChatState, ChatAction } from './chatState';
import { saveChatToLocalStorage } from '../utils/helpers';

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessages = [...state.messages, action.payload];
      saveChatToLocalStorage(newMessages);
      return { ...state, messages: newMessages, error: null };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_CHAT':
      saveChatToLocalStorage([]);
      return { ...state, messages: [], error: null };
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_CONVERSATION_ID':
      return { ...state, currentConversationId: action.payload };
    default:
      return state;
  }
}