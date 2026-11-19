export type UserAccess = 'admin' | 'user'

export interface User {
  id: string,
  name: string,
  email: string,
  password: string,
  access: UserAccess,
  date_created: string,
  date_updated: string
}