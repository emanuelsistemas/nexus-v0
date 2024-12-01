import { Sidebar } from './components/Sidebar'
import { Chat } from './components/Chat'

function App() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <Chat />
    </div>
  )
}

export default App
