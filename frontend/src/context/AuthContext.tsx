import { createContext, useContext, useEffect, useState } from "react";
import {
  verifyAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../api/auth.js";

type User = {
  name: string;
  email: string;
};
type UserAuth = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user cookies are valid to skip login
    async function verifyStatus() {
      try {
        const data = await verifyAuthStatus();
        if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      } catch (error) {
        // If verification fails, user is not logged in
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }
    verifyStatus();
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
    }
  };
  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
