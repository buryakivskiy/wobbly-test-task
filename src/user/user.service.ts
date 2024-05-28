import { Injectable, Inject } from '@nestjs/common';
import { UserError } from './errors/user.error';
import { USER_CONSTANTS } from './user.constants';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUserEntity } from './interfaces/user-entity.interface';
import { IUserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  public async findById(id: number): Promise<IUserEntity> {
    return this.userRepository.findById(id);
  }

  public async findByEmail(email: string): Promise<IUserEntity> {
    return this.userRepository.findByEmail(email);
  }

  public async create(payload: ICreateUser): Promise<IUserEntity> {
    try {
        const emailExists = await this.userRepository.existsByEmail(
            payload.email,
        );
  
        if (emailExists) {
            throw UserError.EmailAlreadyTaken();
        }

        const user = await this.userRepository.create({
            email: payload.email,
            passwordHash: payload.passwordHash,
        });

        return user;
    } catch (error) {
        throw error;
    }
  }
}