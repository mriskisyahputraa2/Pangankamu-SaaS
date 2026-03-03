// Auth feature types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface Store {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
