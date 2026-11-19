import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react'

import type { User } from '../../../models/User'
import { authService } from '../services/authServices'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => User
  register: (name: string, email: string, password: string) => User
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: {children: ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => authService.getCurrentUser()
  )

  const login = (email: string, password: string): User => {
    const user = authService.login(email, password)

    setCurrentUser(user)

    return user
  }

  const register = (name: string, email: string, password: string): User => {
    return authService.register(name, email, password)
  }

  const logout = () => {
    authService.logout()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProcider')
  }

  return context
}