// src/lib/api.ts
import { authStorage } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Track {
  name: string;
  artist: string;
  album?: string;
  genre?: string;
  bpm?: number;
  matchPercentage?: number;
}

export interface IdentifyResponse {
  success: boolean;
  track: Track;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface Echo {
  id: string;
  trackName: string;
  artist: string;
  genre?: string;
  bpm?: number;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timestamp: string;
  user?: string;
}

export interface EchoesResponse {
  success: boolean;
  echoes: Echo[];
  total: number;
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.details?.[0] || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.details?.[0] || 'Login failed');
    }
    
    return response.json();
  },

  googleAuth: async (credential: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Google authentication failed');
    }

    return response.json();
  },
};

// Identify API
export const identifyApi = {
  identify: async (audioData: string, location?: Location): Promise<IdentifyResponse> => {
    const response = await fetch(`${API_BASE_URL}/identify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ audioData, location }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.details?.[0] || 'Music identification failed');
    }
    
    return response.json();
  },
};

// Echoes API
export const echoesApi = {
  getAll: async (limit = 100): Promise<EchoesResponse> => {
    const response = await fetch(`${API_BASE_URL}/echoes?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch echoes');
    }
    
    return response.json();
  },

  getNearby: async (longitude: number, latitude: number, maxDistance = 5000): Promise<EchoesResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/echoes/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch nearby echoes');
    }
    
    return response.json();
  },
};
