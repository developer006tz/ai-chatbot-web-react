import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message } from '../types'
import { generateMessageId } from '../utils/helpers'
import { API_CONFIG } from '../utils/constants'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  currentConversationId: string | null
}

interface ChatActions {
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  retryLastMessage: () => Promise<void>
  setError: (error: string | null) => void
  addMessage: (message: Message) => void
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  currentConversationId: null,
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
          error: null,
        })),

      setError: (error: string | null) =>
        set({ error, isLoading: false }),

      sendMessage: async (content: string) => {
        const apiKey = API_CONFIG.apiKey

        if (!apiKey) {
          set({ error: 'API key is missing. Please check your settings.' })
          return
        }

        if (!content.trim()) {
          set({ error: 'Message cannot be empty' })
          return
        }

        const userMessage: Message = {
          id: generateMessageId(),
          content: content.trim(),
          role: 'user',
          timestamp: Date.now(),
        }

        set({ isLoading: true, error: null })
        set((state) => ({ messages: [...state.messages, userMessage] }))

        try {
          const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
              model: API_CONFIG.defaultModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful AI assistant.'
                },
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

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `API error: ${response.status}`)
          }

          const data = await response.json()
          const assistantMessage: Message = {
            id: generateMessageId(),
            content: data.choices[0].message.content,
            role: 'assistant',
            timestamp: Date.now(),
          }

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get response from AI'
          set((state) => ({
            messages: state.messages.filter(msg => msg.id !== userMessage.id),
            error: errorMessage,
            isLoading: false
          }))
        }
      },

      clearChat: () => set({ ...initialState }),

      retryLastMessage: async () => {
        const { messages, isLoading, sendMessage } = get()
        const lastUserMessage = [...messages]
          .reverse()
          .find(message => message.role === 'user')

        if (lastUserMessage && !isLoading) {
          const lastMessageIndex = messages.findIndex(msg => msg.id === lastUserMessage.id)
          set((state) => ({
            messages: state.messages.slice(0, lastMessageIndex),
            error: null
          }))
          await sendMessage(lastUserMessage.content)
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        currentConversationId: state.currentConversationId
      })
    }
  )
)