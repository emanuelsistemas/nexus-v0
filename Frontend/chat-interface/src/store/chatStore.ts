import { create } from 'zustand'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

type ChatStore = {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  addMessage: (role: 'user' | 'assistant', content: string) => void
  createNewConversation: () => void
  selectConversation: (id: string) => void
  deleteConversation: (id: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  addMessage: (role, content) => {
    const newMessage = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage],
      conversations: state.conversations.map((conv) =>
        conv.id === state.currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date(),
            }
          : conv
      ),
    }))
  },
  createNewConversation: () => {
    const newConversation = {
      id: Math.random().toString(36).substring(7),
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: newConversation.id,
      messages: [],
    }))
  },
  selectConversation: (id) => {
    set((state) => ({
      currentConversationId: id,
      messages: state.conversations.find((conv) => conv.id === id)?.messages || [],
    }))
  },
  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
      messages:
        state.currentConversationId === id ? [] : state.messages,
    }))
  },
}))
