import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import { MockType } from './types/mock.type';
import { PRODUCT_CONSTANTS } from '../product.constants';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { TypeormProductEntity } from '../entities/typeorm-product.entity';
import { generateRandomProduct } from './utils/generate-random-product.util';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { TypeormProductRepository } from '../repositories/typeorm-product.repository';

describe('TypeormProductRepository', () => {
    let repository: IProductRepository;
    let typeormRepositoryMock: MockType<Repository<TypeormProductEntity>>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            useClass: TypeormProductRepository,
            provide: PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
          },
          {
            provide: getRepositoryToken(TypeormProductEntity),
            useFactory: jest.fn(() => ({
              save: jest.fn(),
              find: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
              findOne: jest.fn(),
            })),
          },
        ],
      }).compile();
  
      repository = module.get<IProductRepository>(
        PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
      );
      typeormRepositoryMock = module.get(getRepositoryToken(TypeormProductEntity));
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    describe('findById', () => {
      it('should successfully find by id', async () => {
        const product = generateRandomProduct();
        const id = product.id;

        jest.spyOn(typeormRepositoryMock, 'findOne').mockResolvedValue(product);

        const result = await repository.findById(id);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['user']
        });

        expect(result).toEqual(product);
      });

      it('should return null', async () => {
        const product = generateRandomProduct();
        const id = product.id;

        jest.spyOn(typeormRepositoryMock, 'findOne').mockResolvedValue(null);

        const result = await repository.findById(id);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['user']
        });

        expect(result).toEqual(null);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const id = crypto.randomInt(1, 100);

        jest.spyOn(typeormRepositoryMock, 'findOne').mockRejectedValue(error);

        await expect(repository.findById(id)).rejects.toThrow(error);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['user']
        });
      });
    });

    describe('find', () => {
      it('should successfully find', async () => {
        const products = [
            generateRandomProduct(),
            generateRandomProduct(),
            generateRandomProduct(),
        ];

        jest.spyOn(typeormRepositoryMock, 'find').mockResolvedValue(products);

        const result = await repository.find();

        expect(typeormRepositoryMock.find).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.find).toHaveBeenCalledWith({ relations: ['user'] });

        expect(result).toEqual(products);
      });

      it('should return null', async () => {
        jest.spyOn(typeormRepositoryMock, 'find').mockResolvedValue(null);

        const result = await repository.find();

        expect(typeormRepositoryMock.find).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.find).toHaveBeenCalledWith({ relations: ['user'] });

        expect(result).toEqual(null);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');

        jest.spyOn(typeormRepositoryMock, 'find').mockRejectedValue(error);

        await expect(repository.find()).rejects.toThrow(error);

        expect(typeormRepositoryMock.find).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.find).toHaveBeenCalledWith({ relations: ['user'] });
      });
    });

    describe('create', () => {
      it('should successfully create', async () => {
        const product = generateRandomProduct();
        const data: ICreateProduct = {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            user: product.user
        }

        jest.spyOn(typeormRepositoryMock, 'create').mockReturnValue(product);
        jest.spyOn(typeormRepositoryMock, 'save').mockResolvedValue(product);

        const result = await repository.create(data);

        expect(typeormRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.create).toHaveBeenCalledWith(data);

        expect(typeormRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.save).toHaveBeenCalledWith(product);

        expect(result).toEqual(product);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const product = generateRandomProduct();
        const data: ICreateProduct = {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            user: product.user
        }

        jest.spyOn(typeormRepositoryMock, 'save').mockRejectedValue(error);

        await expect(repository.create(data)).rejects.toThrow(error);

        expect(typeormRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.create).toHaveBeenCalledWith(data);

        expect(typeormRepositoryMock.save).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      it('should successfully update', async () => {
        const data = generateRandomProduct();
        const id = data.id;

        jest.spyOn(typeormRepositoryMock, 'update').mockReturnValue(undefined);

        const result = await repository.update(id, data);

        expect(typeormRepositoryMock.update).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.update).toHaveBeenCalledWith(id, data);

        expect(result).toEqual(undefined);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const data = generateRandomProduct();
        const id = data.id;

        jest.spyOn(typeormRepositoryMock, 'update').mockRejectedValue(error);

        await expect(repository.update(id, data)).rejects.toThrow(error);

        expect(typeormRepositoryMock.update).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.update).toHaveBeenCalledWith(id, data);
      });
    });

    describe('delete', () => {
      it('should successfully delete', async () => {
        const product = generateRandomProduct();
        const id = product.id;

        jest.spyOn(typeormRepositoryMock, 'delete').mockReturnValue(undefined);

        const result = await repository.delete(id);

        expect(typeormRepositoryMock.delete).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.delete).toHaveBeenCalledWith(id);

        expect(result).toEqual(undefined);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const product = generateRandomProduct();
        const id = product.id;

        jest.spyOn(typeormRepositoryMock, 'delete').mockRejectedValue(error);

        await expect(repository.delete(id)).rejects.toThrow(error);

        expect(typeormRepositoryMock.delete).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.delete).toHaveBeenCalledWith(id);
      });
    });
});