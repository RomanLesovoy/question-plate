import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  lastname: string;
}

export class TokenDto {
  @IsString()
  token: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    created_at: Date;
    last_login: Date;
  };
}
