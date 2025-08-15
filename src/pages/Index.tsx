import { useState } from 'react'
import { AuthPage } from '@/components/auth/AuthPage'
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout'

interface User {
  name: string
  email: string
  avatar?: string
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null)

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return <WorkspaceLayout user={user} onLogout={handleLogout} />
};

export default Index;
