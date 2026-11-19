import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../../../models/User";
import { authService } from "../services/authServices";
import { supabase } from "../../../lib/supabase";
import type { Session } from "@supabase/supabase-js";

// Local
// interface AuthContextType {
//   currentUser: User | null
//   login: (email: string, password: string) => User
//   register: (name: string, email: string, password: string) => User
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: {children: ReactNode}) {
//   const [currentUser, setCurrentUser] = useState<User | null>(
//     () => authService.getCurrentUser()
//   )

//   const login = (email: string, password: string): User => {
//     const user = authService.login(email, password)

//     setCurrentUser(user)

//     return user
//   }

//   const register = (name: string, email: string, password: string): User => {
//     return authService.register(name, email, password)
//   }

//   const logout = () => {
//     authService.logout()
//     setCurrentUser(null)
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         login,
//         register,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)

//   if (!context) {
//     throw new Error('useAuth must be used inside AuthProcider')
//   }

//   return context
// }

// Supabase
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Supabase authentication changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Retrieve profile whenever the session changes
  useEffect(() => {
    let active = true;

    if (!session) {
      setCurrentUser(null);
      setLoading(false);

      return;
    }

    setLoading(true);

    authService
      .getProfile(session.user.id, session.user.email || "")
      .then((user) => {
        if (active) {
          setCurrentUser(user);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);

    setCurrentUser(user);

    return user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    return await authService.register(name, email, password);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
