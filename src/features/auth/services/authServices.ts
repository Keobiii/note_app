import type { User } from "../../../models/User"

const USERS_KEY = 'simple_auth_users'
const SESSION_KEY = 'simple_auth_session'

function initializeUsers(): User[] {
  const storedUsers = localStorage.getItem(USERS_KEY)

  if (storedUsers) {
    return JSON.parse(storedUsers) as User[]
  }

  const now = new Date().toISOString()

  const dummyUsers: User[] = [
    {
       id: crypto.randomUUID(),
      name: 'Administrator',
      email: 'admin@gmail.com',
      password: 'admin123',
      access: 'admin',
      date_created: now,
      date_updated: now,
    },
    {
      id: crypto.randomUUID(),
      name: 'Regular User',
      email: 'user@gmail.com',
      password: 'user123',
      access: 'user',
      date_created: now,
      date_updated: now,
    },
  ]

  localStorage.setItem(USERS_KEY, JSON.stringify(dummyUsers))

  return dummyUsers
}

function getUsers(): User[] {
  return initializeUsers()
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// login
function login(email: string, password: string): User {
  const users = getUsers()

  const user = users.find(
    (item) => 
      item.email.toLowerCase() === email.trim().toLowerCase() &&
    item.password ===  password
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  localStorage.setItem(SESSION_KEY, user.id)

  return user
}

// register
function register(name: string, email: string, password: string): User {
  const users = getUsers()

  // check if theres existing user
  const existingUser = users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase()
  )

  if (existingUser) {
    throw new Error('Email is already registered')
  }

  const now = new Date().toISOString()

  const newUser: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    access: 'user',
    date_created: now,
    date_updated: now
  }

  users.push(newUser);

  saveUsers(users);

  return newUser
}

// get current logged in user
function getCurrentUser(): User | null {
  const userId = localStorage.getItem(SESSION_KEY)

  if (!userId) {
    return null
  }

  const users = getUsers()

  return users.find((user) => user.id === userId) || null
}

// logout
function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
}