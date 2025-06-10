'use client'

import { LoginForm } from "@/app/login/login-form"
import ClientOnly from "@/components/ClientOnly"

export default function Page() {
  return (
    <ClientOnly>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-tr from-teal-50 via-teal-100 to-teal-200">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </ClientOnly>
  )
}
