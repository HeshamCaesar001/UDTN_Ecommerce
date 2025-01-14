import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from './enums/role.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ///  TESTING FOR REGISTERATION
  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: Roles.USER,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue({
        ...registerDto,
        password: 'hashedPassword',
      });

      const result = await service.register(registerDto);

      expect(result.email).toBe(registerDto.email);
      expect(result.password).toBe('hashedPassword');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: Roles.USER,
      };

      mockUserRepository.findOne.mockResolvedValue({
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if an invalid role is provided', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: 'invalid_role' as Roles,
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an InternalServerErrorException if there is an error saving the user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: Roles.USER,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue(new Error('Error'));
      await expect(service.register(registerDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  //////////////////******************************************************************** */
  ///////////////// TESTING FOR LOGIN
  describe('login', () => {
    it('should successfully log in and return a JWT token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: Roles.USER,
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwtToken');
      const result = await service.login(loginDto);

      expect(result).toBe('jwtToken');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      bcrypt.compare.mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an InternalServerErrorException if there is an error logging in', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      mockUserRepository.findOne.mockRejectedValue(new Error('Error'));
      await expect(service.login(loginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
