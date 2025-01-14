import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product 1', description: 'Name of the product' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Nice product',
    description: 'Description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10, description: 'Stock count of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
