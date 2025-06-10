import bcrypt from 'bcryptjs'

interface User {
  email: string
  name: string
  passwordHash: string
}

export class AuthService {
  // Helper to get all users
  static getUsers(): User[] {
    if (typeof window === 'undefined') return []
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }

  // Helper to save all users
  static setUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users))
  }

  static async login(email: string, password: string): Promise<boolean> {
    const users = this.getUsers()
    const user = users.find(u => u.email === email)
    if (!user) return false
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (isValid) {
      // Save session (without passwordHash)
      const { passwordHash, ...userWithoutPassword } = user
      localStorage.setItem('authUser', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  static async signup(email: string, name: string, password: string): Promise<boolean> {
    const users = this.getUsers()
    if (users.find(u => u.email === email)) {
      // Email already registered
      return false
    }
    const passwordHash = await bcrypt.hash(password, 10)
    users.push({ email, name, passwordHash })
    this.setUsers(users)
    // Optionally log in after signup:
    localStorage.setItem('authUser', JSON.stringify({ email, name }))
    return true
  }

  static logout(): void {
    localStorage.removeItem('authUser')
  }

  static isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('authUser')
  }

  static getAuthUser(): Omit<User, 'passwordHash'> | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('authUser')
    return user ? JSON.parse(user) : null
  }
}