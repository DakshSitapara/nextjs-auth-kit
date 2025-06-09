'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAuthUser, isAuthenticated, logout } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {  LogOut } from 'lucide-react'
import {SectionCards} from '@/components/section-cards'
import {ChartAreaInteractive} from '@/components/chart-area-interactive'

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
  }, [router])

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
    </div>
  )
}

  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <nav className="w-full bg-white dark:bg-zinc-900 shadow px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-10xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Welcome, {user.name}!</h2>
          <SectionCards />
          <div className="mt-8">
          <ChartAreaInteractive />
          </div>
        </div>
      </main>
      <footer className="w-full bg-white dark:bg-zinc-900 shadow px-6 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  )
}
