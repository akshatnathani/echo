// src/components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { authStorage } from '@/lib/auth';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  if (authStorage.isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}
