import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import * as crypto from 'node:crypto';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { PasswordService } from '../services/password.service';
import { generateRandomUser } from '../../user/tests/utils/generate-random-user.util';
import { AuthError } from '../errors/auth.error';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let userService: UserService;
    let passwordService: PasswordService;
  
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date() });
    });
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(),
            },
          },
          {
            provide: UserService,
            useValue: {
              create: jest.fn(),
              findByEmail: jest.fn(),
            },
          },
          {
            provide: PasswordService,
            useValue: {
              hashPassword: jest.fn(),
              validatePassword: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<AuthService>(AuthService);
      jwtService = module.get<JwtService>(JwtService);
      userService = module.get<UserService>(UserService);
      passwordService = module.get<PasswordService>(PasswordService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('signIn', () => {
      it('should return token if credentials are valid', async () => {
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        const token = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
        jest.spyOn(passwordService, 'validatePassword').mockResolvedValue(true);
        jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    
        const result = await service.signIn(user.email, password);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(passwordService.validatePassword).toHaveBeenCalledTimes(1);
        expect(passwordService.validatePassword).toHaveBeenCalledWith(password, user.passwordHash);

        expect(jwtService.sign).toHaveBeenCalledTimes(1);
        expect(jwtService.sign).toHaveBeenCalledWith({ username: user.email });

        expect(result).toEqual({
            authorized: true,
            token: token,
          });
      });

      it('should throw invalid credentials (user not found)', async () => {
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        const token = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
    
        await expect(service.signIn(user.email, password)).rejects.toThrow(AuthError.InvalidCredentials());
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(passwordService.validatePassword).toHaveBeenCalledTimes(0);

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });

      it('should throw invalid credentials (wrong password)', async () => {
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
        jest.spyOn(passwordService, 'validatePassword').mockResolvedValue(false);
    
        await expect(service.signIn(user.email, password)).rejects.toThrow(AuthError.InvalidCredentials());
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(passwordService.validatePassword).toHaveBeenCalledTimes(1);
        expect(passwordService.validatePassword).toHaveBeenCalledWith(password, user.passwordHash);

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });

      it('should throw internal error (findByEmail)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(userService, 'findByEmail').mockRejectedValue(error);
    
        await expect(service.signIn(user.email, password)).rejects.toThrow(error);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(passwordService.validatePassword).toHaveBeenCalledTimes(0);

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });

      it('should throw internal error (validatePassword)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
        jest.spyOn(passwordService, 'validatePassword').mockRejectedValue(error);
    
        await expect(service.signIn(user.email, password)).rejects.toThrow(error);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(passwordService.validatePassword).toHaveBeenCalledTimes(1);
        expect(passwordService.validatePassword).toHaveBeenCalledWith(password, user.passwordHash);

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });
    });

    describe('signUp', () => {
      it('should return token if user created succesfully', async () => {
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        const hashedPassword = crypto.randomBytes(20).toString('hex');
        const token = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(passwordService, 'hashPassword').mockResolvedValue(hashedPassword);
        jest.spyOn(userService, 'create').mockResolvedValue(user);
        jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    
        const result = await service.signUp(user.email, password);

        expect(passwordService.hashPassword).toHaveBeenCalledTimes(1);
        expect(passwordService.hashPassword).toHaveBeenCalledWith(password);

        expect(userService.create).toHaveBeenCalledTimes(1);
        expect(userService.create).toHaveBeenCalledWith({
            email: user.email,
            passwordHash: hashedPassword,
        });

        expect(jwtService.sign).toHaveBeenCalledTimes(1);
        expect(jwtService.sign).toHaveBeenCalledWith({ username: user.email });

        expect(result).toEqual({
            user: user,
            token: token,
          });
      });

      it('should throw internal error (hashPassword)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(passwordService, 'hashPassword').mockRejectedValue(error);

        await expect(service.signUp(user.email, password)).rejects.toThrow(error);

        expect(passwordService.hashPassword).toHaveBeenCalledTimes(1);
        expect(passwordService.hashPassword).toHaveBeenCalledWith(password);

        expect(userService.create).toHaveBeenCalledTimes(0);

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });

      it('should throw internal error (create)', async () => {
        const error = new Error('Internal Server');
        const user = generateRandomUser();
        const password = crypto.randomBytes(20).toString('hex');
        const hashedPassword = crypto.randomBytes(20).toString('hex');
        
        jest.spyOn(passwordService, 'hashPassword').mockResolvedValue(hashedPassword);
        jest.spyOn(userService, 'create').mockRejectedValue(error);

        await expect(service.signUp(user.email, password)).rejects.toThrow(error);

        expect(passwordService.hashPassword).toHaveBeenCalledTimes(1);
        expect(passwordService.hashPassword).toHaveBeenCalledWith(password);

        expect(userService.create).toHaveBeenCalledTimes(1);
        expect(userService.create).toHaveBeenCalledWith({
            email: user.email,
            passwordHash: hashedPassword,
        });

        expect(jwtService.sign).toHaveBeenCalledTimes(0);
      });
    });

    describe('validateUser', () => {
      it('should return user', async () => {
        const user = generateRandomUser();

        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
    
        const result = await service.validateUser(user.email);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(user.email);

        expect(result).toEqual(user)
      });

      it('should return null', async () => {
        const email = crypto.randomBytes(20).toString('hex');

        jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
    
        const result = await service.validateUser(email);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(email);

        expect(result).toEqual(null)
      });

      it('should throw internal error', async () => {
        const error = new Error('Internal Server');
        const email = crypto.randomBytes(20).toString('hex');

        jest.spyOn(userService, 'findByEmail').mockRejectedValue(error);
    
        await expect(service.validateUser(email)).rejects.toThrow(error);
    
        expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        expect(userService.findByEmail).toHaveBeenCalledWith(email);
      });
    });
});