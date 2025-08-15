import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  MousePointer, 
  Palette, 
  Trash2, 
  Download,
  Users
} from 'lucide-react'

interface WhiteboardProps {
  isVisible: boolean
  onClose: () => void
}

type Tool = 'select' | 'pen' | 'eraser' | 'rectangle' | 'circle'

export const Whiteboard = ({ isVisible, onClose }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#a855f7')
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [connectedUsers] = useState(['Alice', 'Bob', 'Carol'])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set default styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 3
    ctx.strokeStyle = color
  }, [color])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'select') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPosition({ x, y })

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color
    ctx.lineWidth = tool === 'eraser' ? 20 : 3
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (tool === 'rectangle') {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeRect(lastPosition.x, lastPosition.y, x - lastPosition.x, y - lastPosition.y)
    } else if (tool === 'circle') {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const radius = Math.sqrt(Math.pow(x - lastPosition.x, 2) + Math.pow(y - lastPosition.y, 2))
      ctx.beginPath()
      ctx.arc(lastPosition.x, lastPosition.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#000000']

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-full max-h-[90vh] glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Collaborative Whiteboard</CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {connectedUsers.slice(0, 3).map((user, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2">
                    {user}
                  </Badge>
                ))}
                {connectedUsers.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2">
                    +{connectedUsers.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 h-full">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
            {/* Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant={tool === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('select')}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'pen' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('pen')}
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('eraser')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'rectangle' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('rectangle')}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'circle' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool('circle')}
              >
                <Circle className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Colors */}
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadCanvas}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ 
                cursor: tool === 'eraser' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' 
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}