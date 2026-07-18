"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { USUARIOS, User } from "@/app/_lib/mock-data";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => false,
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("divelop_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("divelop_user");
      }
    }
    setIsLoading(false);
  }, []);

  function login(email: string, password: string): boolean {
    const found = USUARIOS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("divelop_user", JSON.stringify(found));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("divelop_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
