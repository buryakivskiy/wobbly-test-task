import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export interface IProductEntity {
  readonly id: number;
  
  name: string;
  
  description: string;

  category: string;

  price: number;

  user: IUserEntity;

  readonly updatedAt: Date;
  
  readonly createdAt: Date;
}