import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WorkspaceMap } from './WorkspaceMap'
import { Whiteboard } from './Whiteboard'
import { AdminPanel } from './AdminPanel'
import { 
  Palette, 
  Shield, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Mic,
  Video,
  ScreenShare,
  Phone
} from 'lucide-react'

interface WorkspaceLayoutProps {
  user: { name: string; email: string; avatar?: string }
  onLogout: () => void
}

export const WorkspaceLayout = ({ user, onLogout }: WorkspaceLayoutProps) => {
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  const connectedUsers = [
    'Alice Johnson',
    'Bob Smith', 
    'Carol Davis',
    'David Wilson'
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SpatialHub
            </h1>
            <Badge variant="secondary" className="animate-pulse-slow">
              Live Session
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* User Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Connected Users Count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {connectedUsers.length} online
            </div>

            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Collaboration Tools
            </h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setShowWhiteboard(true)}
              >
                <Palette className="h-4 w-4 mr-2" />
                Whiteboard
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setShowAdminPanel(true)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>

              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Team Chat
              </Button>

              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <Separator />

          {/* Media Controls */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Media Controls
            </h3>
            <div className="space-y-2">
              <Button 
                variant={isInCall ? (isMuted ? "destructive" : "secondary") : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMuted(!isMuted)}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>

              <Button 
                variant={isInCall ? (isVideoOff ? "destructive" : "secondary") : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                <Video className="h-4 w-4 mr-2" />
                {isVideoOff ? 'Start Video' : 'Stop Video'}
              </Button>

              <Button 
                variant={isScreenSharing ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <ScreenShare className="h-4 w-4 mr-2" />
                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
              </Button>

              <Button 
                variant={isInCall ? "destructive" : "default"}
                className="w-full justify-start"
                onClick={() => setIsInCall(!isInCall)}
              >
                <Phone className="h-4 w-4 mr-2" />
                {isInCall ? 'Leave Call' : 'Join Call'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Online Users */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Online Users
            </h3>
            <div className="space-y-2">
              {connectedUsers.slice(0, 4).map((userName, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                      alt={userName}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border border-background" />
                  </div>
                  <span className="text-sm">{userName}</span>
                </div>
              ))}
              {connectedUsers.length > 4 && (
                <div className="text-xs text-muted-foreground p-2">
                  +{connectedUsers.length - 4} more users
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Map Area */}
        <main className="flex-1 relative">
          <WorkspaceMap currentUser={user} />
        </main>

        {/* Right Sidebar - Video Chat */}
        <aside className="w-80 border-l border-border bg-card/30 backdrop-blur-sm p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Video Chat
              </h3>
              <Badge variant={isInCall ? "default" : "secondary"}>
                {isInCall ? 'In Call' : 'Not Connected'}
              </Badge>
            </div>

            {isInCall ? (
              <div className="space-y-3">
                {/* Video Tiles */}
                {connectedUsers.slice(0, 3).map((userName, index) => (
                  <Card key={index} className="aspect-video bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                      alt={userName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                      {userName}
                    </div>
                  </Card>
                ))}

                {/* Local Video */}
                <Card className="aspect-video bg-secondary/50 flex items-center justify-center relative overflow-hidden border-2 border-primary">
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                    You {isMuted && '(Muted)'} {isVideoOff && '(Video Off)'}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="aspect-video bg-secondary/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Phone className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Move near other users to start video chat
                  </p>
                </div>
              </Card>
            )}
          </div>
        </aside>
      </div>

      {/* Floating Components */}
      <Whiteboard isVisible={showWhiteboard} onClose={() => setShowWhiteboard(false)} />
      <AdminPanel isVisible={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
    </div>
  )
}