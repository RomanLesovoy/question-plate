import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UnauthorizedException,
  ValidationPipe,
  Response
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokenDto, AuthResponseDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Successfully logged in',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Invalid credentials' 
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Response({ passthrough: true }) res
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Cookie settings
    // res.cookie('token', result.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 24 * 60 * 60 * 1000 // 24 hours
    // });

    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'successfully registered',
    type: AuthResponseDto 
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully logged out' })
  async logout(@Response({ passthrough: true }) res) {
    res.clearCookie('token');
    return { message: 'Successfully logged out' };
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify JWT token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token is valid' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token is invalid' })
  async verifyToken(
    @Body(ValidationPipe) tokenDto: TokenDto
  ) {
    return this.authService.verifyToken(tokenDto.token);
  }
}
