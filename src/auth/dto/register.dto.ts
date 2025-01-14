import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'passowrd', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'user', description: 'User Role [admin-user]' })
  @IsString()
  role: Roles;
}
