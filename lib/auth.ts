import bcrypt from 'bcryptjs'

interface User {
  email: string
  name: string
  passwordHash?: string
}

export class AuthService {
  static async login(email: string, password: string): Promise<boolean> {
    const user = this.getAuthUser()
    if (!user || !user.passwordHash) return false
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (isValid) {
      const { passwordHash, ...userWithoutPassword } = user
      localStorage.setItem('authUser', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  static async signup(email: string, name: string, password: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(password, 10)
    localStorage.setItem('authUser', JSON.stringify({ email, name, passwordHash }))
    return true
  }

  static logout(): void {
    localStorage.removeItem('authUser')
  }

  static isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('authUser')
  }

  static getAuthUser(): User | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('authUser')
    return user ? JSON.parse(user) : null
  }
}