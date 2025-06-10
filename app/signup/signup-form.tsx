'use client'

import { useRouter } from 'next/navigation'
import { useState,useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormState {
  name: string
  email: string
  password: string
  error: string | null
  isLoading: boolean
}

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    error: null,
    isLoading: false,
  })
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && AuthService.isAuthenticated()) {
      router.replace('/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])


  const validateForm = (): boolean => {
    if (!formState.name || !formState.email || !formState.password) {
      setFormState((prev) => ({ ...prev, error: 'Please fill in all fields' }))
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setFormState((prev) => ({ ...prev, error: 'Please enter a valid email' }))
      return false
    }
    if (formState.password.length < 6) {
      setFormState((prev) => ({ ...prev, error: 'Password must be at least 6 characters' }))
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

    const success = await AuthService.signup(formState.email, formState.name, formState.password)
    if (success) {
      router.push('/dashboard')
    } else {
      setFormState((prev) => ({
        ...prev,
        error: 'Failed to create account',
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {formState.error && (
                <div className="text-sm text-red-500 text-center">{formState.error}</div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formState.name}
                  onChange={handleChange('name')}
                  required
                  disabled={formState.isLoading}
                />
              </div>
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
                {formState.isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}