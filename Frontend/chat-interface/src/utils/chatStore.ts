import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ChatCategory = "Frontend" | "Backend" | "Banco de Dados" | "API" | "Servicos" | "Outros";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  category: ChatCategory;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: (projectId: string, title: string, category: ChatCategory) => Conversation;
  updateConversation: (conversationId: string, updates: Partial<Pick<Conversation, "title" | "category">>) => void;
  deleteConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp">) => void;
  setActiveConversation: (conversationId: string | null) => void;
  getProjectConversations: (projectId: string) => Conversation[];
  getConversation: (conversationId: string) => Conversation | null;
}

export const CHAT_CATEGORIES: ChatCategory[] = [
  "Frontend",
  "Backend",
  "Banco de Dados",
  "API",
  "Servicos",
  "Outros",
];

export const useChatStore = create<ChatStore>(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (projectId: string, title: string, category: ChatCategory) => {
        const now = new Date().toISOString();
        const conversation: Conversation = {
          id: `conv_${Date.now()}`,
          projectId,
          title,
          category,
          messages: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          conversations: [...state.conversations, conversation],
          activeConversationId: conversation.id,
        }));

        return conversation;
      },

      updateConversation: (conversationId: string, updates: Partial<Pick<Conversation, "title" | "category">>) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
        }));
      },

      deleteConversation: (conversationId: string) => {
        set((state) => {
          const newConversations = state.conversations.filter(
            (conv) => conv.id !== conversationId
          );
          return {
            conversations: newConversations,
            activeConversationId:
              state.activeConversationId === conversationId
                ? newConversations[0]?.id || null
                : state.activeConversationId,
          };
        });
      },

      addMessage: (conversationId: string, messageData) => {
        const message: Message = {
          id: `msg_${Date.now()}`,
          ...messageData,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
        }));
      },

      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
      },

      getProjectConversations: (projectId) => {
        return get().conversations
          .filter((conv) => conv.projectId === projectId)
          .sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB.getTime() - dateA.getTime();
          });
      },

      getConversation: (conversationId) => {
        return get().conversations.find((conv) => conv.id === conversationId) || null;
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
