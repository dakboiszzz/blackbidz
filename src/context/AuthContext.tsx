// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define the shape of our memory
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Create the actual context container
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. The Provider: This wraps your app and "provides" the memory to it
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // When the app first loads, check if we already have a token saved
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("admin_token", token); // Save the badge
    setIsAuthenticated(true); // Remember we are logged in
  };

  const logout = () => {
    localStorage.removeItem("admin_token"); // Throw away the badge
    setIsAuthenticated(false); // Forget we are logged in
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. A custom hook so components can easily tap into this memory
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};