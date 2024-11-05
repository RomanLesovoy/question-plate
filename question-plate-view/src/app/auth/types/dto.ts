export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
  lastname: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    created_at: Date;
    last_login: Date;
  };
}
