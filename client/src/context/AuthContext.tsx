/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sl_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('sl_token')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        const userData = res.data.data!;
        const verifiedUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as User['role'],
        };
        setUser(verifiedUser);
        localStorage.setItem('sl_user', JSON.stringify(verifiedUser));
      } catch {
        localStorage.removeItem('sl_token');
        localStorage.removeItem('sl_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('sl_token', newToken);
    localStorage.setItem('sl_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
