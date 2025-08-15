import { useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Video, Mic, MicOff, VideoOff } from 'lucide-react'

interface User {
  id: string
  name: string
  avatar: string
  x: number
  y: number
  isInCall: boolean
  isMuted: boolean
  isVideoOff: boolean
}

interface Zone {
  id: string
  name: string
  type: 'meeting' | 'social' | 'work' | 'private'
  x: number
  y: number
  width: number
  height: number
  userCount: number
}

interface WorkspaceMapProps {
  currentUser: { name: string; email: string; avatar?: string }
}

export const WorkspaceMap = ({ currentUser }: WorkspaceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userPosition, setUserPosition] = useState({ x: 400, y: 300 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const [otherUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      x: 200,
      y: 150,
      isInCall: true,
      isMuted: false,
      isVideoOff: false
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      x: 600,
      y: 200,
      isInCall: false,
      isMuted: true,
      isVideoOff: false
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
      x: 150,
      y: 450,
      isInCall: true,
      isMuted: false,
      isVideoOff: true
    }
  ])

  const zones: Zone[] = [
    {
      id: 'meeting-room',
      name: 'Meeting Room',
      type: 'meeting',
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      userCount: 3
    },
    {
      id: 'social-lounge',
      name: 'Social Lounge',
      type: 'social',
      x: 500,
      y: 150,
      width: 200,
      height: 150,
      userCount: 1
    },
    {
      id: 'work-area',
      name: 'Focus Zone',
      type: 'work',
      x: 100,
      y: 400,
      width: 300,
      height: 150,
      userCount: 2
    },
    {
      id: 'private-room',
      name: 'Private Room',
      type: 'private',
      x: 500,
      y: 400,
      width: 180,
      height: 120,
      userCount: 0
    }
  ]

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - userPosition.x,
      y: e.clientY - userPosition.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Keep user within bounds
    const bounds = mapRef.current?.getBoundingClientRect()
    if (bounds) {
      const clampedX = Math.max(20, Math.min(bounds.width - 60, newX))
      const clampedY = Math.max(20, Math.min(bounds.height - 60, newY))
      setUserPosition({ x: clampedX, y: clampedY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const isUserInZone = (userX: number, userY: number, zone: Zone) => {
    return userX >= zone.x && 
           userX <= zone.x + zone.width && 
           userY >= zone.y && 
           userY <= zone.y + zone.height
  }

  const currentZone = zones.find(zone => isUserInZone(userPosition.x, userPosition.y, zone))

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      const bounds = mapRef.current?.getBoundingClientRect()
      if (bounds) {
        const clampedX = Math.max(20, Math.min(bounds.width - 60, newX))
        const clampedY = Math.max(20, Math.min(bounds.height - 60, newY))
        setUserPosition({ x: clampedX, y: clampedY })
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, dragStart])

  return (
    <div className="h-full relative">
      {/* Zone Status Bar */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="glass p-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentZone ? "default" : "secondary"} className="animate-pulse-slow">
              {currentZone ? currentZone.name : 'Open Space'}
            </Badge>
            {currentZone && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                {currentZone.userCount}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-secondary relative overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 25px 25px, hsl(var(--border)) 1px, transparent 1px),
            radial-gradient(circle at 75px 75px, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      >
        {/* Zones */}
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`absolute rounded-lg zone-${zone.type} backdrop-blur-sm transition-all duration-300 hover:brightness-110`}
            style={{
              left: zone.x,
              top: zone.y,
              width: zone.width,
              height: zone.height
            }}
          >
            <div className="p-3 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm text-foreground">{zone.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{zone.type} zone</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {zone.userCount} online
              </div>
            </div>
          </div>
        ))}

        {/* Other Users */}
        {otherUsers.map((user) => (
          <div
            key={user.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float"
            style={{ left: user.x, top: user.y }}
          >
            <div className="relative group">
              <Avatar className={`w-10 h-10 border-2 ${user.isInCall ? 'border-accent avatar-glow' : 'border-border'} transition-all duration-300`}>
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </Avatar>
              
              {/* Status indicators */}
              <div className="absolute -top-1 -right-1 flex gap-1">
                {user.isInCall && (
                  <>
                    {user.isMuted ? (
                      <MicOff className="h-3 w-3 text-destructive bg-background rounded-full p-0.5" />
                    ) : (
                      <Mic className="h-3 w-3 text-success bg-background rounded-full p-0.5" />
                    )}
                    {user.isVideoOff ? (
                      <VideoOff className="h-3 w-3 text-destructive bg-background rounded-full p-0.5" />
                    ) : (
                      <Video className="h-3 w-3 text-success bg-background rounded-full p-0.5" />
                    )}
                  </>
                )}
              </div>
              
              {/* Name tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background px-2 py-1 rounded-md text-xs whitespace-nowrap shadow-lg">
                  {user.name}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Current User */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: userPosition.x, top: userPosition.y }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-primary animate-glow">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </Avatar>
            
            {/* Current user indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge variant="default" className="text-xs px-1 py-0">You</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
