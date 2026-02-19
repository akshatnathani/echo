// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authStorage } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
