import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'node:crypto';
import { UserService } from '../../user/services/user.service';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductService } from '../services/product.service';
import { PRODUCT_CONSTANTS } from '../product.constants';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { generateRandomUser } from '../../user/tests/utils/generate-random-user.util';
import { generateRandomProduct } from './utils/generate-random-product.util';
import { IUpdateProduct } from '../interfaces/update-product.interface';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { ProductError } from '../errors/product.error';

describe('ProductService', () => {
    let service: ProductService;
    let repository: IProductRepository;
  
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date() });
    });
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ProductService,
          {
            provide: PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
            useValue: {
              create: jest.fn(),
              findById: jest.fn(),
              find: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
          {
            provide: UserService,
            useValue: {
              findById: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<ProductService>(ProductService);
      repository = module.get<IProductRepository>(
        PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
      );
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('findById', () => {
      it('should successfully find by id', async () => {
        const product = generateRandomProduct();
        const id = product.id;

        jest.spyOn(repository, 'findById').mockResolvedValue(product);

        const result = await service.findById(id);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);

        expect(result).toEqual(product);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Server');
        const id = crypto.randomInt(1, 100);

        jest.spyOn(repository, 'findById').mockRejectedValue(error);

        await expect(service.findById(id)).rejects.toThrow(error);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
      });

      it('should throw not found error', async () => {
        const id = crypto.randomInt(1, 100);

        jest.spyOn(repository, 'findById').mockResolvedValue(undefined);

        await expect(service.findById(id)).rejects.toThrow(ProductError.NotFound());

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
      });
    });

    describe('find', () => {
      it('should successfully find', async () => {
        const products = [
            generateRandomProduct(),
            generateRandomProduct(),
            generateRandomProduct(),
        ];

        jest.spyOn(repository, 'find').mockResolvedValue(products);

        const result = await service.find();

        expect(repository.find).toHaveBeenCalledTimes(1);

        expect(result).toEqual(products);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Server');

        jest.spyOn(repository, 'find').mockRejectedValue(error);

        await expect(service.find()).rejects.toThrow(error);

        expect(repository.find).toHaveBeenCalledTimes(1);
      });
    });

    describe('create', () => {
      it('should successfully create', async () => {
        const payload: ICreateProduct = {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            user: generateRandomUser()
        };

        const product = generateRandomProduct(payload);

        jest.spyOn(repository, 'create').mockResolvedValue(product);

        const result = await service.create(payload);

        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(payload);

        expect(result).toEqual(product);
      });

      it('should throw product not created error', async () => {
        const error = new Error('Product not created');
        const payload: ICreateProduct = {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            user: generateRandomUser()
        };

        jest.spyOn(repository, 'create').mockRejectedValue(error);

        await expect(service.create(payload)).rejects.toThrow(error);

        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(payload);        
      });
    });

    describe('update', () => {
      it('should successfully update', async () => {
        const payload: IUpdateProduct = {
            id: crypto.randomInt(1, 100),
            product: {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            },
            user: generateRandomUser()
        };
  
        const product = generateRandomProduct({
            id: payload.id,
            user: payload.user,
        });

        const updatedProduct: IProductEntity = {
            ...product,
            ...payload.product,
        }

        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);
  
        const result = await service.update(payload);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(payload.id);
  
        expect(repository.update).toHaveBeenCalledTimes(1);
        expect(repository.update).toHaveBeenCalledWith(payload.id, updatedProduct);
  
        expect(result).toEqual(updatedProduct);
      });

      it('should throw not found error (product not exists)', async () => {
        const payload: IUpdateProduct = {
            id: crypto.randomInt(1, 100),
            product: {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            },
            user: generateRandomUser()
        };

        jest.spyOn(repository, 'findById').mockResolvedValue(undefined);
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);
  
        await expect(service.update(payload)).rejects.toThrow(ProductError.NotFound());

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(payload.id);
  
        expect(repository.update).toHaveBeenCalledTimes(0);
      })

      it('should throw not found error (wrong user)', async () => {
        const payload: IUpdateProduct = {
            id: crypto.randomInt(1, 100),
            product: {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            },
            user: generateRandomUser()
        };
  
        const product = generateRandomProduct({
            id: payload.id,
            user: generateRandomUser(),
        });

        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);
  
        await expect(service.update(payload)).rejects.toThrow(ProductError.NotFound());

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(payload.id);
  
        expect(repository.update).toHaveBeenCalledTimes(0);
      })

      it('should throw internal server error (findById)', async () => {
        const error = new Error('Internal Server');
        const payload: IUpdateProduct = {
            id: crypto.randomInt(1, 100),
            product: {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            },
            user: generateRandomUser()
        };

        jest.spyOn(repository, 'findById').mockRejectedValue(error);
  
        await expect(service.update(payload)).rejects.toThrow(error);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(payload.id);
  
        expect(repository.update).toHaveBeenCalledTimes(0);
      })

      it('should throw internal server error (update)', async () => {
        const error = new Error('Internal Server');
        const payload: IUpdateProduct = {
            id: crypto.randomInt(1, 100),
            product: {
            name: crypto.randomBytes(5).toString('hex'),
            description: crypto.randomBytes(10).toString('hex'),
            category: crypto.randomBytes(5).toString('hex'),
            price: crypto.randomInt(1, 100),
            },
            user: generateRandomUser()
        };
  
        const product = generateRandomProduct({
            id: payload.id,
            user: payload.user,
        });

        const updatedProduct: IProductEntity = {
            ...product,
            ...payload.product,
        }

        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'update').mockRejectedValue(error);
  
        await expect(service.update(payload)).rejects.toThrow(error);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(payload.id);
  
        expect(repository.update).toHaveBeenCalledTimes(1);
        expect(repository.update).toHaveBeenCalledWith(payload.id, updatedProduct);
      })
    })

    describe('delete', () => {
      it('should successfully delete', async () => {
        const id =  crypto.randomInt(1, 100);
        const user = generateRandomUser()
    
        const product = generateRandomProduct({
          id: id,
          user: user,
        });
  
        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    
        const result = await service.delete(id, user);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
    
        expect(repository.delete).toHaveBeenCalledTimes(1);
        expect(repository.delete).toHaveBeenCalledWith(id);
    
        expect(result).toEqual(product);
      });

      it('should throw not found error (findById)', async () => {
        const id =  crypto.randomInt(1, 100);
        const user = generateRandomUser()
  
        jest.spyOn(repository, 'findById').mockResolvedValue(undefined);
        jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    
        await expect(service.delete(id, user)).rejects.toThrow(ProductError.NotFound());

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
    
        expect(repository.delete).toHaveBeenCalledTimes(0);
      });

      it('should throw not found error (wrong user)', async () => {
        const id =  crypto.randomInt(1, 100);
        const user = generateRandomUser()

        const product = generateRandomProduct({
          id: id,
          user: generateRandomUser(),
        });
  
        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    
        await expect(service.delete(id, user)).rejects.toThrow(ProductError.NotFound());

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
    
        expect(repository.delete).toHaveBeenCalledTimes(0);
      });

      it('should throw internal server error (findById)', async () => {
        const error = new Error('Internal Server');
        const id =  crypto.randomInt(1, 100);
        const user = generateRandomUser()
  
        jest.spyOn(repository, 'findById').mockRejectedValue(error);
        jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    
        await expect(service.delete(id, user)).rejects.toThrow(error);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
    
        expect(repository.delete).toHaveBeenCalledTimes(0);
      });

      it('should throw internal server error (delete)', async () => {
        const error = new Error('Internal Server');
        const id =  crypto.randomInt(1, 100);
        const user = generateRandomUser()

        const product = generateRandomProduct({
          id: id,
          user: user,
        });
  
        jest.spyOn(repository, 'findById').mockResolvedValue(product);
        jest.spyOn(repository, 'delete').mockRejectedValue(error);
    
        await expect(service.delete(id, user)).rejects.toThrow(error);

        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
    
        expect(repository.delete).toHaveBeenCalledTimes(1);
        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    })
})