import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import { USER_CONSTANTS } from '../user.constants';
import { MockType } from 'src/product/tests/types/mock.type';
import { ICreateUser } from '../interfaces/create-user.interface';
import { TypeormUserEntity } from '../entities/typeorm-user.entity';
import { generateRandomUser } from './utils/generate-random-user.util';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { TypeormUserRepository } from '../repositories/typeorm-user.repository';

describe('TypeormUserRepository', () => {
    let repository: IUserRepository;
    let typeormRepositoryMock: MockType<Repository<TypeormUserEntity>>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            useClass: TypeormUserRepository,
            provide: USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
          },
          {
            provide: getRepositoryToken(TypeormUserEntity),
            useFactory: jest.fn(() => ({
              save: jest.fn(),
              find: jest.fn(),
              create: jest.fn(),
              exists: jest.fn(),
              findOne: jest.fn(),
              findOneBy: jest.fn(),
            })),
          },
        ],
      }).compile();
  
      repository = module.get<IUserRepository>(
        USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
      );
      typeormRepositoryMock = module.get(getRepositoryToken(TypeormUserEntity));
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    describe('findById', () => {
      it('should successfully find by id', async () => {
        const user = generateRandomUser();
        const id = user.id;

        jest.spyOn(typeormRepositoryMock, 'findOneBy').mockResolvedValue(user);

        const result = await repository.findById(id);

        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });

        expect(result).toEqual(user);
      });

      it('should return null', async () => {
        const user = generateRandomUser();
        const id = user.id;

        jest.spyOn(typeormRepositoryMock, 'findOneBy').mockResolvedValue(null);

        const result = await repository.findById(id);

        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });

        expect(result).toEqual(null);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const id = crypto.randomInt(1, 100);

        jest.spyOn(typeormRepositoryMock, 'findOneBy').mockRejectedValue(error);

        await expect(repository.findById(id)).rejects.toThrow(error);

        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });
      });
    });

    describe('findByEmail', () => {
      it('should successfully find by email', async () => {
        const user = generateRandomUser();
        const email = user.email;

        jest.spyOn(typeormRepositoryMock, 'findOne').mockResolvedValue(user);

        const result = await repository.findByEmail(email);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });

        expect(result).toEqual(user);
      });

      it('should return null', async () => {
        const user = generateRandomUser();
        const email = user.email;

        jest.spyOn(typeormRepositoryMock, 'findOne').mockResolvedValue(null);

        const result = await repository.findByEmail(email);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });

        expect(result).toEqual(null);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const email = crypto.randomBytes(10).toString('hex');

        jest.spyOn(typeormRepositoryMock, 'findOne').mockRejectedValue(error);

        await expect(repository.findByEmail(email)).rejects.toThrow(error);

        expect(typeormRepositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.findOne).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });
      });
    });

    describe('existsByEmail', () => {
      it('should successfully check if exists by email', async () => {
        const user = generateRandomUser();
        const email = user.email;

        jest.spyOn(typeormRepositoryMock, 'exists').mockResolvedValue(true);

        const result = await repository.existsByEmail(email);

        expect(typeormRepositoryMock.exists).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.exists).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });

        expect(result).toEqual(true);
      });

      it('should return null', async () => {
        const user = generateRandomUser();
        const email = user.email;

        jest.spyOn(typeormRepositoryMock, 'exists').mockResolvedValue(false);

        const result = await repository.existsByEmail(email);

        expect(typeormRepositoryMock.exists).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.exists).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });

        expect(result).toEqual(false);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const email = crypto.randomBytes(10).toString('hex');

        jest.spyOn(typeormRepositoryMock, 'exists').mockRejectedValue(error);

        await expect(repository.existsByEmail(email)).rejects.toThrow(error);

        expect(typeormRepositoryMock.exists).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.exists).toHaveBeenCalledWith({ 
            where: {
              email,
            } 
        });
      });
    });

    describe('create', () => {
      it('should successfully create', async () => {
        const user = generateRandomUser();
        const data: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash,
        }

        jest.spyOn(typeormRepositoryMock, 'create').mockReturnValue(user);
        jest.spyOn(typeormRepositoryMock, 'save').mockResolvedValue(user);

        const result = await repository.create(data);

        expect(typeormRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.create).toHaveBeenCalledWith(data);

        expect(typeormRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.save).toHaveBeenCalledWith(user);

        expect(result).toEqual(user);
      });

      it('should throw error', async () => {
        const error = new Error('Internal Error');
        const user = generateRandomUser();
        const data: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash,
        }

        jest.spyOn(typeormRepositoryMock, 'save').mockRejectedValue(error);

        await expect(repository.create(data)).rejects.toThrow(error);

        expect(typeormRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(typeormRepositoryMock.create).toHaveBeenCalledWith(data);

        expect(typeormRepositoryMock.save).toHaveBeenCalledTimes(1);
      });
    });
});