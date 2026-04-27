// src/app/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Register from '../features/auth/Register';
import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import Recognize from '../features/recognize/Recognize';
import Library from '../features/library/Library';
import History from '../features/history/History';
import AdminUpload from '../features/admin/AdminUpload';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/recognize',
    element: <ProtectedRoute><Recognize /></ProtectedRoute>,
  },
  {
    path: '/library',
    element: <ProtectedRoute><Library /></ProtectedRoute>,
  },
  {
    path: '/history',
    element: <ProtectedRoute><History /></ProtectedRoute>,
  },
  {
    path: '/admin/upload',
    element: <ProtectedRoute><AdminUpload /></ProtectedRoute>,
  },
]);
