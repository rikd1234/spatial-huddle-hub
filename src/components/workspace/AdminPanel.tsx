import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { 
  Shield, 
  Users, 
  Volume, 
  VolumeX, 
  Lock, 
  Unlock, 
  MessageSquare, 
  UserX,
  Settings,
  Map
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminPanelProps {
  isVisible: boolean
  onClose: () => void
}

interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  isMuted: boolean
  zone: string
}

interface Zone {
  id: string
  name: string
  isLocked: boolean
  userCount: number
  type: 'meeting' | 'social' | 'work' | 'private'
}

export const AdminPanel = ({ isVisible, onClose }: AdminPanelProps) => {
  const [announcement, setAnnouncement] = useState('')
  const [globalMute, setGlobalMute] = useState(false)
  
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      isOnline: true,
      isMuted: false,
      zone: 'Meeting Room'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      isOnline: true,
      isMuted: true,
      zone: 'Social Lounge'
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
      isOnline: false,
      isMuted: false,
      zone: 'Focus Zone'
    }
  ])

  const [zones, setZones] = useState<Zone[]>([
    {
      id: 'meeting-room',
      name: 'Meeting Room',
      isLocked: false,
      userCount: 3,
      type: 'meeting'
    },
    {
      id: 'social-lounge',
      name: 'Social Lounge',
      isLocked: false,
      userCount: 1,
      type: 'social'
    },
    {
      id: 'work-area',
      name: 'Focus Zone',
      isLocked: false,
      userCount: 2,
      type: 'work'
    },
    {
      id: 'private-room',
      name: 'Private Room',
      isLocked: true,
      userCount: 0,
      type: 'private'
    }
  ])

  const sendAnnouncement = () => {
    if (!announcement.trim()) return
    
    toast.success('Announcement sent to all users')
    setAnnouncement('')
  }

  const toggleZoneLock = (zoneId: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, isLocked: !zone.isLocked }
        : zone
    ))
    
    const zone = zones.find(z => z.id === zoneId)
    toast.success(`${zone?.name} ${zone?.isLocked ? 'unlocked' : 'locked'}`)
  }

  const muteUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    toast.success(`${user?.name} ${user?.isMuted ? 'unmuted' : 'muted'}`)
  }

  const kickUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    toast.success(`${user?.name} removed from workspace`)
  }

  const toggleGlobalMute = () => {
    setGlobalMute(!globalMute)
    toast.success(globalMute ? 'Global mute disabled' : 'All users muted')
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-full max-h-[90vh] glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Admin Control Panel</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Administrator
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Controls
              </h3>
              
              {/* Announcement */}
              <Card className="bg-secondary/50">
                <CardContent className="p-4 space-y-3">
                  <Label htmlFor="announcement">Send Announcement</Label>
                  <div className="flex gap-2">
                    <Input
                      id="announcement"
                      placeholder="Type your message..."
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAnnouncement()}
                    />
                    <Button onClick={sendAnnouncement} size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Global Mute */}
              <Card className="bg-secondary/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {globalMute ? <VolumeX className="h-4 w-4" /> : <Volume className="h-4 w-4" />}
                      <Label>Global Mute</Label>
                    </div>
                    <Switch
                      checked={globalMute}
                      onCheckedChange={toggleGlobalMute}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Map className="h-5 w-5" />
                Zone Management
              </h3>
              
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {zones.map((zone) => (
                    <Card key={zone.id} className="bg-secondary/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{zone.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {zone.userCount} users
                              <Badge variant="outline" className="text-xs">
                                {zone.type}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleZoneLock(zone.id)}
                            className={zone.isLocked ? 'text-destructive' : 'text-success'}
                          >
                            {zone.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator />

          {/* User Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </h3>
            
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {users.map((user) => (
                  <Card key={user.id} className="bg-secondary/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                              user.isOnline ? 'bg-success' : 'bg-muted'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.zone}</p>
                          </div>
                          {user.isMuted && (
                            <Badge variant="destructive" className="text-xs">
                              Muted
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => muteUser(user.id)}
                            className={user.isMuted ? 'text-success' : 'text-warning'}
                          >
                            {user.isMuted ? <Volume className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => kickUser(user.id)}
                            className="text-destructive"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}