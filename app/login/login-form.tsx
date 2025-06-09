'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormState {
  email: string
  password: string
  error: string | null
  isLoading: boolean
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    error: null,
    isLoading: false,
  })
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  if (typeof window !== 'undefined' && AuthService.isAuthenticated()) {
    router.replace('/dashboard')
    return null 
  }

  if (isCheckingAuth) {
    setIsCheckingAuth(false)
  }

  const validateForm = (): boolean => {
    if (!formState.email || !formState.password) {
      setFormState((prev) => ({ ...prev, error: 'Please fill in all fields' }))
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setFormState((prev) => ({ ...prev, error: 'Please enter a valid email' }))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState((prev) => ({ ...prev, error: null, isLoading: true }))

    if (!validateForm()) {
      setFormState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    const success = await AuthService.login(formState.email, formState.password)
    if (success) {
      router.push('/dashboard')
    } else {
      setFormState((prev) => ({
        ...prev,
        error: 'Invalid credentials',
        isLoading: false,
      }))
    }
  }

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value, error: null }))
  }

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-full max-w-sm mx-auto bg-transparent backdrop-blur-sm border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {formState.error && (
                <div className="text-sm text-red-500 text-center">{formState.error}</div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formState.email}
                  onChange={handleChange('email')}
                  required
                  disabled={formState.isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange('password')}
                  required
                  disabled={formState.isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={formState.isLoading}>
                {formState.isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}