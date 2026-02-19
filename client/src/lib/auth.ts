// src/lib/auth.ts
import type { User } from './api';

const USER_KEY = 'echoic_user';
const TOKEN_KEY = 'echoic_token';

export const authStorage = {
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return authStorage.getUser() !== null && authStorage.getToken() !== null;
  },

  clearAll: (): void => {
    authStorage.removeUser();
    authStorage.removeToken();
  },
};
