import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { Message } from './Message'
import { useChatStore } from '../store/chatStore'

export function Chat() {
  const [input, setInput] = useState('')
  const { messages, addMessage } = useChatStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage('user', input)
    // Simular resposta do assistente (posteriormente será integrado com a API)
    setTimeout(() => {
      addMessage('assistant', 'Esta é uma resposta simulada do assistente.')
    }, 1000)

    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="message-container overflow-y-auto">
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-secondary text-secondary-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
