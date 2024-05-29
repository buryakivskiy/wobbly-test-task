import { TestingModule, Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { USER_CONSTANTS } from '../user.constants';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { generateRandomUser } from './utils/generate-random-user.util';
import { ICreateUser } from '../interfaces/create-user.interface';
import { UserError } from '../errors/user.error';

describe('UserService', () => {
    let service: UserService;
    let repository: IUserRepository;
  
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date() });
    });
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
            useValue: {
              create: jest.fn(),
              findById: jest.fn(),
              findByEmail: jest.fn(),
              existsByEmail: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<UserService>(UserService);
      repository = module.get<IUserRepository>(
        USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
      );
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('findById', () => {
      it('should successfully find by id', async () => {
        const user = generateRandomUser();
        const id = user.id;
  
        jest.spyOn(repository, 'findById').mockResolvedValue(user);
  
        const result = await service.findById(id);
  
        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
  
        expect(result).toEqual(user);
      });

      it('should return null', async () => {
        const user = generateRandomUser();
        const id = user.id;
  
        jest.spyOn(repository, 'findById').mockResolvedValue(null);
  
        const result = await service.findById(id);
  
        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
  
        expect(result).toEqual(null);
      });

      it('should throw internal error', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const id = user.id;
  
        jest.spyOn(repository, 'findById').mockRejectedValue(error);

        await expect(service.findById(id)).rejects.toThrow(error);
  
        expect(repository.findById).toHaveBeenCalledTimes(1);
        expect(repository.findById).toHaveBeenCalledWith(id);
      });
    });

    describe('findByEmail', () => {
      it('should successfully find by email', async () => {
        const user = generateRandomUser();
        const email = user.email;
  
        jest.spyOn(repository, 'findByEmail').mockResolvedValue(user);
  
        const result = await service.findByEmail(email);
  
        expect(repository.findByEmail).toHaveBeenCalledTimes(1);
        expect(repository.findByEmail).toHaveBeenCalledWith(email);
  
        expect(result).toEqual(user);
      });

      it('should return null', async () => {
        const user = generateRandomUser();
        const email = user.email;
  
        jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
  
        const result = await service.findByEmail(email);
  
        expect(repository.findByEmail).toHaveBeenCalledTimes(1);
        expect(repository.findByEmail).toHaveBeenCalledWith(email);
  
        expect(result).toEqual(null);
      });

      it('should throw internal error', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const email = user.email;
  
        jest.spyOn(repository, 'findByEmail').mockRejectedValue(error);

        await expect(service.findByEmail(email)).rejects.toThrow(error);
  
        expect(repository.findByEmail).toHaveBeenCalledTimes(1);
        expect(repository.findByEmail).toHaveBeenCalledWith(email);
      });
    });

    describe('create', () => {
      it('should successfully create', async () => {
        const user = generateRandomUser();
        const payload: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash
        };
    
        jest.spyOn(repository, 'existsByEmail').mockResolvedValue(false);
        jest.spyOn(repository, 'create').mockResolvedValue(user);
    
        const result = await service.create(payload);
    
        expect(repository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(repository.existsByEmail).toHaveBeenCalledWith(payload.email);

        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith({
            email: payload.email,
            passwordHash: payload.passwordHash,
        });
    
        expect(result).toEqual(user);
      });

      it('should throw email already taken', async () => {
        const user = generateRandomUser();
        const payload: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash
        };
    
        jest.spyOn(repository, 'existsByEmail').mockResolvedValue(true);
    
        await expect(service.create(payload)).rejects.toThrow(UserError.EmailAlreadyTaken());
    
        expect(repository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(repository.existsByEmail).toHaveBeenCalledWith(payload.email);

        expect(repository.create).toHaveBeenCalledTimes(0);
      });

      it('should throw internal error (existsByEmail)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const payload: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash
        };
    
        jest.spyOn(repository, 'existsByEmail').mockRejectedValue(error);
    
        await expect(service.create(payload)).rejects.toThrow(error);
    
        expect(repository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(repository.existsByEmail).toHaveBeenCalledWith(payload.email);

        expect(repository.create).toHaveBeenCalledTimes(0);
      });

      it('should throw internal error (create)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const payload: ICreateUser = {
            email: user.email,
            passwordHash: user.passwordHash
        };
    
        jest.spyOn(repository, 'existsByEmail').mockResolvedValue(false);
        jest.spyOn(repository, 'create').mockRejectedValue(error);
    
        await expect(service.create(payload)).rejects.toThrow(error);
    
        expect(repository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(repository.existsByEmail).toHaveBeenCalledWith(payload.email);

        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith({
            email: payload.email,
            passwordHash: payload.passwordHash,
        });
      });
    });
});