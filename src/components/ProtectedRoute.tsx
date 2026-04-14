// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // If the global memory says we are NOT logged in, kick them back to /login
  // The 'replace' keyword means they can't just hit the "Back" button to bypass it
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they ARE logged in, let them see whatever secret page they were trying to access
  return <>{children}</>;
}