import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'passowrd', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
