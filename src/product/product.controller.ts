import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorators';
import { Roles } from '../auth/enums/role.enum';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * @route POST /products
   * @description Create a new product (Admin only)
   * @param {CreateProductDto} createProductDto - Product data structure to be created
   * @returns {Promise<{ message: string, product: Product }>} A success message and The created product
   */
  @Role(Roles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (only admins allowed)',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return { message: 'Product created successfully', product };
  }

  /**
   * @route GET /products
   * @description Get all products form DB (Public but signedIn)
   * @returns {Promise<{ message: string, products: Product[] }>} A success message and List of all Products in DB
   */
  @Get()
  @ApiOperation({ summary: 'Get all products (Public but signedIn)' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  async findAll() {
    const products = await this.productService.findAll();
    return { message: 'All products retrieved', products };
  }

  /**
   * @route GET /products/:id
   * @description Get a single product by ID (Public but signedIn)
   * @param {number} id - Product ID
   * @returns {Promise<{ message: string, product: Product }>}A success message and selected product details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID (Public but signedIn)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product details retrieved' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: number) {
    const product = await this.productService.findOne(id);
    return { message: `Product with ID ${id} retrieved`, product };
  }

  /**
   * @route PUT /products/:id
   * @description Update a product by ID (Admin only)
   * @param {number} id - Product ID
   * @param {UpdateProductDto} updateProductDto - Updated product data
   * @returns {Promise<{ message: string, updatedProduct: Product }>} A success message and Updated product
   */
  @Role(Roles.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (only admins allowed)',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.update(
      id,
      updateProductDto,
    );
    return {
      message: `Product with ID ${id} updated successfully`,
      updatedProduct,
    };
  }

  /**
   * @route DELETE /products/:id
   * @description Delete a product by ID (Admin only)
   * @param {number} id - Product ID
   * @returns {Promise<{ message: string }>} Deletion success message
   */
  @Role(Roles.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (only admins allowed)',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: number) {
    await this.productService.delete(id);
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
