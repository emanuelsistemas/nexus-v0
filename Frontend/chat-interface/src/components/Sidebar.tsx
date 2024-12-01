import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useChatStore } from '../store/chatStore'

export function Sidebar() {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation,
  } = useChatStore()

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col gap-4">
      <button
        onClick={createNewConversation}
        className="flex items-center gap-2 w-full p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        Nova Conversa
      </button>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors ${
              currentConversationId === conversation.id ? 'bg-secondary' : ''
            }`}
            onClick={() => selectConversation(conversation.id)}
          >
            <span className="text-sm truncate">{conversation.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteConversation(conversation.id)
              }}
              className="p-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
