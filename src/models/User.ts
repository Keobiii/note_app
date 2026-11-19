export type UserAccess = 'admin' | 'user'

// Local
// export interface User {
//   id: string,
//   name: string,
//   email: string,
//   password: string,
//   access: UserAccess,
//   date_created: string,
//   date_updated: string
// }

// Supabase
export interface User {
  id: string,
  name: string,
  email: string,
  access: UserAccess,
  date_created: string,
  date_updated: string
}