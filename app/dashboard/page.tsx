'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAuthUser, isAuthenticated, logout } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    } else {
      const userData = getAuthUser()
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  if (!user) return null // Optionally show a loader

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Email: {user.email}</p>
          <Button onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
