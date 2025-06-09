export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authUser')
  }
  return false
}

export const login = (email: string, name: string) => {
  localStorage.setItem('authUser', JSON.stringify({ email, name }))
}

export const signup = (email: string, name: string) => {
  localStorage.setItem('authUser', JSON.stringify({ email, name }))
}
export const logout = () => {
  localStorage.removeItem('authUser')
}

export const getAuthUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('authUser')
    return user ? JSON.parse(user) : null
  }
  return null
}
