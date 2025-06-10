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
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'


interface User {
  name: string
  email: string
}
const getAvatarColor = (letter: string): string => {
  const colors = [
    'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600',
    'bg-indigo-600', 'bg-pink-600', 'bg-teal-600', 'bg-cyan-600', 'bg-amber-600',
    'bg-lime-600', 'bg-emerald-600', 'bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600',
  ];
  const index = letter.toUpperCase().charCodeAt(0) - 65;
  return colors[index % colors.length] || 'bg-gray-600';
};

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null);
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

  const getInitial = (): string => {
    if (user) return user.name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'G';
  };
 
  const initial = getInitial();
  const avatarColor = getAvatarColor(initial);
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
        <HoverCard openDelay={200} closeDelay={200}>
          <HoverCardTrigger asChild>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer ${avatarColor}`}
            >
              <span className="text-lg font-semibold">{initial}</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-60 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              {/* <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-base font-semibold ${avatarColor}`}>
                {initial}
              </div> */}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full mt-2 text-sm flex gap-2 items-center"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-sm animate-accordion-up-content">
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

          </HoverCardContent>
        </HoverCard>
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