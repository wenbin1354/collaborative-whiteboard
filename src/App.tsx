
import { useState, useRef, useEffect } from 'react'
import { PenTool, Eraser, Users } from 'lucide-react'
import Avatar from "./assets/avatar.png"

// Simulated user data
const users = [
  { id: 1, name: 'Alice', avatar: Avatar },
  { id: 2, name: 'Bob', avatar: Avatar },
  { id: 3, name: 'Charlie', avatar: Avatar },
]

export default function CollaborativeWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [messages, setMessages] = useState<Array<{ user: string; text: string }>>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.lineCap = 'round'
      context.lineJoin = 'round'
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvas.getContext('2d')
    if (context) {
      context.beginPath()
      context.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const context = canvas.getContext('2d')
    if (context) {
      context.lineWidth = brushSize
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, { user: 'You', text: newMessage.trim() }])
      setNewMessage('')
      // Simulate receiving a message from another user
      setTimeout(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        setMessages(prev => [...prev, { user: randomUser.name, text: `Response to "${newMessage.trim()}"` }])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-grow bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Collaborative Whiteboard</h2>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <button
              className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTool('pen')}
            >
              <PenTool className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTool('eraser')}
            >
              <Eraser className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="color-picker" className="text-sm font-medium">Color:</label>
              <input
                id="color-picker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 p-0 border-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="brush-size" className="text-sm font-medium">Brush Size:</label>
              <input
                id="brush-size"
                type="range"
                min={1}
                max={20}
                step={1}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={clearCanvas}>Clear</button>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
      </div>
      <div className="w-full md:w-64 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connected Users
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Chat</h3>
            <div className="h-40 overflow-y-auto border border-gray-200 rounded p-2 mb-2">
              {messages.map((msg, index) => (
                <p key={index} className="mb-1">
                  <strong>{msg.user}:</strong> {msg.text}
                </p>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-2 py-1 border border-gray-300 rounded"
              />
              <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}