// src/app/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Register from '@/features/auth/Register';
import Login from '@/features/auth/Login';
import Home from '@/features/identify/Home';
import Map from '@/features/map/Map';
import AIStories from '@/features/ai/AIStories';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/register" replace />,
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/map',
    element: (
      <ProtectedRoute>
        <Map />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-stories',
    element: (
      <ProtectedRoute>
        <AIStories />
      </ProtectedRoute>
    ),
  },
]);
