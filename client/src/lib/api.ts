// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For session-based auth
});

// For development with Vite proxy, use /api prefix
const isDev = import.meta.env.DEV;
const client = isDev ? axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
}) : api;

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

// Types
export interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RecognitionHistory {
  id: number;
  song_name: string | null;
  confidence: number;
  recognized: boolean;
  timestamp: string;
}

export interface Song {
  id: number;
  name: string;
  singer_name: string | null;
  file_path: string;
  fingerprinted: boolean;
  created_at: string;
}

export interface RecognitionResult {
  song_name: string | null;
  confidence: number;
  recognized: boolean;
}

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await client.post('/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  login: async (data: LoginData): Promise<void> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    await client.post('/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  logout: async (): Promise<void> => {
    await client.get('/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await client.get('/user');
    return response.data;
  },
};

// Recognition API
export const recognitionApi = {
  recognize: async (file: File): Promise<RecognitionResult> => {
    const formData = new FormData();
    formData.append('audio_file', file);
    
    const response = await client.post('/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getHistory: async (): Promise<RecognitionHistory[]> => {
    const response = await client.get('/history');
    return response.data;
  },
};

// Library API
export const libraryApi = {
  getSongs: async (): Promise<Song[]> => {
    const response = await client.get('/library');
    return response.data;
  },

  uploadSong: async (file: File, songName: string, singerName: string): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('audio_file', file);
    formData.append('song_name', songName);
    formData.append('singer_name', singerName);
    
    const response = await client.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
