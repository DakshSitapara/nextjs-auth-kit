'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { SectionCards } from '@/components/section-cards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'

interface User {
  name: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          router.replace('/login')
        } else {
          const userData = AuthService.getAuthUser()
          setUser(userData)
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      AuthService.logout()
      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

return (
  <div className="flex flex-col h-screen overflow-hidden bg-muted text-foreground">
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 shadow px-6 py-4 flex justify-between items-center border-b z-50">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-white/90 hover:text-red-500 hover:shadow-red-500/50"
              >
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>

    <main className="flex-1 overflow-y-auto pt-20 px-6">
      <div className="max-w mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Welcome, {user.name}!</h2>
        <SectionCards />
        <div className="mt-8">
          <ChartAreaInteractive />
        </div>
      </div>
    </main>

    <footer className="w-full bg-white dark:bg-zinc-900 shadow px-6 py-4 text-center text-sm text-muted-foreground *:[a]:hover:text-primary text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:text-blue-500">
      &copy; {new Date().getFullYear()}. All rights reserved. you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
    </footer>
  </div>
)
}