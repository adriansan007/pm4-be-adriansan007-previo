import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { CategoriesService } from '../Categories/categories.service';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductsRepository = {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    addProduct: jest.fn(),
    addProducts: jest.fn(),
    saveProduct: jest.fn(),
  };

  const mockCategoriesService = {
    getCategories: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =========================
  // GET PRODUCTS
  // =========================
  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const productsArray = [{ id: '1', name: 'Test Product' }];

      mockProductsRepository.getProducts.mockResolvedValue(productsArray);

      const result = await service.getProducts();

      expect(result).toEqual(productsArray);
      expect(mockProductsRepository.getProducts).toHaveBeenCalled();
    });
  });

  // =========================
  // GET PRODUCT BY ID
  // =========================
  describe('getProductById', () => {
    it('should return a product if found', async () => {
      const product = { id: '1', name: 'Test Product' };

      mockProductsRepository.getProductById.mockResolvedValue(product);

      const result = await service.getProductById('1');

      expect(result).toEqual(product);
      expect(mockProductsRepository.getProductById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsRepository.getProductById.mockResolvedValue(null);

      await expect(service.getProductById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // =========================
  // ADD PRODUCT
  // =========================
  describe('addProduct', () => {
    const category = { id: 'cat1', name: 'Category 1' };

    it('should create a product successfully', async () => {
      const dto: CreateProductDto = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        stock: 5,
        categoryId: 'cat1',
        available: true,
      };

      const createdProduct = {
        id: '1',
        ...dto,
        category,
      };

      mockCategoriesService.getCategories.mockResolvedValue([category]);
      mockProductsRepository.addProduct.mockResolvedValue(createdProduct);

      const result = await service.addProduct(dto);

      expect(result).toEqual(createdProduct);
      expect(mockCategoriesService.getCategories).toHaveBeenCalled();
      expect(mockProductsRepository.addProduct).toHaveBeenCalled();
    });

    it('should throw BadRequestException if categoryId is missing', async () => {
      const dto = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        stock: 5,
        available: true,
      } as unknown as CreateProductDto;

      await expect(service.addProduct(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const dto: CreateProductDto = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        stock: 5,
        categoryId: 'invalid',
        available: true,
      };

      mockCategoriesService.getCategories.mockResolvedValue([]);

      await expect(service.addProduct(dto)).rejects.toThrow(NotFoundException);
    });
  });

  // =========================
  // UPDATE PRODUCT IMAGE
  // =========================
  describe('updateProductImage', () => {
    it('should update product image successfully', async () => {
      const product = { id: '1', name: 'Test', imgUrl: null };

      mockProductsRepository.getProductById.mockResolvedValue(product);
      mockProductsRepository.saveProduct.mockResolvedValue({
        ...product,
        imgUrl: 'new-image.jpg',
      });

      const result = await service.updateProductImage('1', 'new-image.jpg');

      expect(result.imgUrl).toBe('new-image.jpg');
      expect(mockProductsRepository.saveProduct).toHaveBeenCalled();
    });
  });

  // =========================
  // ADD PRODUCTS (BULK)
  // =========================
  describe('addProducts', () => {
    it('should add multiple products successfully', async () => {
      const products: Partial<{
        name: string;
      }>[] = [{ name: 'Product 1' }, { name: 'Product 2' }];

      mockProductsRepository.addProducts.mockResolvedValue(products);

      const result = await service.addProducts(products);

      expect(result).toEqual(products);
      expect(mockProductsRepository.addProducts).toHaveBeenCalledWith(products);
    });

    it('should throw InternalServerErrorException if repository fails', async () => {
      const products: Partial<{ name: string }>[] = [{ name: 'Product 1' }];

      mockProductsRepository.addProducts.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.addProducts(products)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  // =========================
  // SEED PRODUCTS
  // =========================
  describe('seedProducts', () => {
    it('should seed products successfully', async () => {
      const categories = [
        { id: '1', name: 'Cat 1' },
        { id: '2', name: 'Cat 2' },
        { id: '3', name: 'Cat 3' },
        { id: '4', name: 'Cat 4' },
        { id: '5', name: 'Cat 5' },
      ];

      mockCategoriesService.getCategories.mockResolvedValue(categories);
      mockProductsRepository.addProducts.mockResolvedValue([{ name: 'Test' }]);

      const result = await service.seedProducts();

      expect(result).toBeDefined();
      expect(mockCategoriesService.getCategories).toHaveBeenCalled();
      expect(mockProductsRepository.addProducts).toHaveBeenCalled();
    });

    it('should throw BadRequestException if there are no categories', async () => {
      mockCategoriesService.getCategories.mockResolvedValue([]);

      await expect(service.seedProducts()).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if unexpected error occurs', async () => {
      mockCategoriesService.getCategories.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(service.seedProducts()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
