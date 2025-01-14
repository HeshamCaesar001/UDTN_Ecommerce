import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /// CREATION
  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        stock: 50,
      };
      const product = { id: 1, ...createProductDto };

      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);

      const result = await productService.create(createProductDto);

      expect(result).toEqual(product);
      expect(mockProductRepository.create).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if creation fails', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 100,
        description: 'A test product',
        stock: 50,
      };

      mockProductRepository.save.mockRejectedValue(new Error('Some error'));
      await expect(productService.create(createProductDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  ///// FIND ALL
  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [{ id: 1, name: 'Product 1', price: 100 }];

      mockProductRepository.find.mockResolvedValue(products);

      const result = await productService.findAll();

      expect(result).toEqual(products);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching products fails', async () => {
      mockProductRepository.find.mockRejectedValue(new Error('Some error'));

      await expect(productService.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  /// FIND ONE
  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Product 1', price: 100 };

      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await productService.findOne(1);

      expect(result).toEqual(product);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if fetching product fails', async () => {
      mockProductRepository.findOne.mockRejectedValue(new Error('Some error'));

      await expect(productService.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  /// UPDATE
  describe('update', () => {
    it('should update and return the updated product', async () => {
      const id = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };
      const existingProduct = { id, name: 'Product 1', price: 100 };
      const updatedProduct = { ...existingProduct, ...updateProductDto };

      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      mockProductRepository.merge.mockReturnValue(updatedProduct);
      mockProductRepository.save.mockResolvedValue(updatedProduct);

      const result = await productService.update(id, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockProductRepository.merge).toHaveBeenCalledWith(
        existingProduct,
        updateProductDto,
      );
      expect(mockProductRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should throw a NotFoundException if product not found for update', async () => {
      const id = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.update(id, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if updating product fails', async () => {
      const id = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      mockProductRepository.findOne.mockResolvedValue({
        id,
        name: 'Product 1',
        price: 100,
      });
      mockProductRepository.save.mockRejectedValue(new Error('Some error'));

      await expect(productService.update(id, updateProductDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  /// DELETE
  describe('delete', () => {
    it('should delete a product and return a success message', async () => {
      const id = 1;
      const product = { id, name: 'Product 1', price: 100 };

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.remove.mockResolvedValue(product);

      const result = await productService.delete(id);

      expect(result).toEqual({
        message: `Product with ID ${id} deleted successfully`,
      });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw a NotFoundException if product not found for deletion', async () => {
      const id = 1;

      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(productService.delete(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if deleting product fails', async () => {
      const id = 1;
      const product = { id, name: 'Product 1', price: 100 };

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.remove.mockRejectedValue(new Error('Some error'));

      await expect(productService.delete(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
