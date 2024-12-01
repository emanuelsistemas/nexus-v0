import { UserCircleIcon } from '@heroicons/react/24/solid'

type MessageProps = {
  role: 'user' | 'assistant'
  content: string
}

export function Message({ role, content }: MessageProps) {
  return (
    <div className={`message ${role === 'user' ? 'user-message' : 'assistant-message'}`}>
      <div className="flex-shrink-0">
        <UserCircleIcon className="h-8 w-8 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  )
}
