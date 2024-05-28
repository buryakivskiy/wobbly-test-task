import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUserEntity } from './interfaces/user-entity.interface';
import { TypeormUserEntity } from './entities/typeorm-user.entity';
import { IUserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(TypeormUserEntity)
    private readonly userRepository: Repository<TypeormUserEntity>,
  ) {}

  public async findById(id: number): Promise<IUserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  public async findByEmail(email: string): Promise<IUserEntity> {
    const user = await this.userRepository.findOne({ 
      where: {
        email,
      } 
    });

    return user;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.exists({
      where: {
        email,
      },
    });

    return exists;
  }

  public async create(data: ICreateUser): Promise<IUserEntity> {
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }
}