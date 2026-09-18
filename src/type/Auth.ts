


export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

 
export type AuthFormData = LoginRequest & Partial<SignUpRequest>;
export type AuthMode = 'login' | 'signup';


