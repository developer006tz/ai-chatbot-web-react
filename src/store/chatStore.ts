import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Message } from '../types'
import { Database } from '../types/supabase'
import { API_CONFIG } from '../utils/constants'

type Chat = Database['public']['Tables']['chats']['Row']
type DbMessage = Database['public']['Tables']['messages']['Row']

interface ChatState {
  chats: Chat[]
  currentChat: Chat | null
  messages: Message[]
  isLoading: boolean
  error: string | null
}

interface ChatActions {
  initializeRealtimeSubscription: () => void
  createNewChat: () => Promise<string>
  updateChatTitle: (chatId: string, title: string) => Promise<void>
  loadChats: () => Promise<void>
  loadMessages: (chatId: string) => Promise<void>
  setCurrentChat: (chat: Chat | null) => void
  sendMessage: (content: string) => Promise<void>
  clearCurrentChat: () => void
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  ...initialState,

  initializeRealtimeSubscription: () => {
    // Subscribe to new messages
    supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as DbMessage
          if (newMessage.chat_id === get().currentChat?.id) {
            set((state) => ({
              messages: [...state.messages, {
                id: newMessage.id,
                content: newMessage.content,
                role: newMessage.role,
                timestamp: new Date(newMessage.created_at).getTime()
              }]
            }))
          }
        }
      )
      .subscribe()
  },

  createNewChat: async () => {
    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert({
          title: 'New Chat',
          user_id: (await supabase.auth.getUser()).data.user?.id as string
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        chats: [...state.chats, chat],
        currentChat: chat
      }))

      return chat.id
    } catch (error) {
      set({ error: 'Failed to create new chat' })
      throw error
    }
  },

  updateChatTitle: async (chatId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', chatId)

      if (error) throw error

      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === chatId ? { ...chat, title } : chat
        ),
        currentChat: state.currentChat?.id === chatId
          ? { ...state.currentChat, title }
          : state.currentChat
      }))
    } catch (error) {
      set({ error: 'Failed to update chat title' })
    }
  },

  loadChats: async () => {
    try {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ chats })
    } catch (error) {
      set({ error: 'Failed to load chats' })
    }
  },

  loadMessages: async (chatId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error

      set({
        messages: messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.created_at).getTime()
        }))
      })
    } catch (error) {
      set({ error: 'Failed to load messages' })
    }
  },

  setCurrentChat: (chat) => {
    set({ currentChat: chat })
    if (chat) {
      get().loadMessages(chat.id)
    }
  },

  sendMessage: async (content: string) => {
    const { currentChat } = get()
    if (!currentChat) {
      set({ error: 'No active chat' })
      return
    }

    try {
      set({ isLoading: true, error: null })

      // Insert user message
      const { data: userMessage, error: userMessageError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChat.id,
          role: 'user',
          content
        })
        .select()
        .single()

      if (userMessageError) throw userMessageError

      // If this is the first message, update chat title
      if (get().messages.length === 0) {
        const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '')
        await get().updateChatTitle(currentChat.id, newTitle)
      }

      // Get AI response
      const apiKey = API_CONFIG.apiKey
      if (!apiKey) throw new Error('API key is missing')

      const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.defaultModel,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            ...get().messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content }
          ],
          temperature: API_CONFIG.temperature,
          max_tokens: API_CONFIG.maxTokens
        })
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      // Insert AI response
      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChat.id,
          role: 'assistant',
          content: aiResponse
        })

      if (aiMessageError) throw aiMessageError

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearCurrentChat: () => {
    set({ currentChat: null, messages: [] })
  },
}))