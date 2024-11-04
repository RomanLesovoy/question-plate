export type User = {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  last_login: Date | null;
};

export type CreateUserDto = {
  email: string;
  password: string;
};