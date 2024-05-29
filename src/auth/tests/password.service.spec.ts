import { Test, TestingModule } from '@nestjs/testing';
import { hash, compare } from 'bcrypt';
import { PasswordService } from '../services/password.service';

jest.mock('bcrypt');

describe('PasswordService', () => {
    let service: PasswordService;
    const mockHash = hash as jest.Mock;
    const mockCompare = compare as jest.Mock;
  
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date() });
    });
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            PasswordService,
        ],
      }).compile();
  
      service = module.get<PasswordService>(PasswordService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('validatePassword', () => {
      it('should return true if passwords match', async () => {
        mockCompare.mockResolvedValue(true);

        const result = await service.validatePassword('password', 'hashedPassword');

        expect(result).toBe(true);
        expect(mockCompare).toHaveBeenCalledWith('password', 'hashedPassword');
      });

      it('should return false if passwords do not match', async () => {
        mockCompare.mockResolvedValue(false);

        const result = await service.validatePassword('password', 'hashedPassword');

        expect(result).toBe(false);
        expect(mockCompare).toHaveBeenCalledWith('password', 'hashedPassword');
      });
    });

    describe('hashPassword', () => {
      it('should return hashed password', async () => {
        const hashed = 'hashedPassword';
        mockHash.mockResolvedValue(hashed);

        const result = await service.hashPassword('password');

        
        expect(result).toBe(hashed);
        expect(mockHash).toHaveBeenCalledWith('password', 10);
      });
    });
});