import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @route POST /auth/register
   * @description Register a new user
   * @param {RegisterDto} registerDto - User registration details
   * @returns {Promise<{ user: UserEntity }>} Registered User
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return user;
  }

  /**
   * @route POST /auth/login
   * @description Log in a user and generate a JWT token
   * @param {LoginDto} loginDto - User login details
   * @returns {Promise<{ accessToken: string }>} JWT access token
   */
  @Post('login')
  @ApiOperation({ summary: 'Log in a user and generate a JWT token' })
  @ApiResponse({ status: 200, description: 'JWT access token generated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const accessToken = await this.authService.login(loginDto);
      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException(
        'An unknown error occurred during login',
      );
    }
  }
}
