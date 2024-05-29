import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { USER_CONSTANTS } from '../user.constants';
import { IUserEntity } from '../interfaces/user-entity.interface';
import { TypeormProductEntity } from '../../product/entities/typeorm-product.entity';

@Entity('User')
export class TypeormUserEntity implements IUserEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: USER_CONSTANTS.DOMAIN.ENTITY.EMAIL.MAX_LENGTH,
  })
  public email: string;

  @Column({ type: 'varchar' })
  public passwordHash: string;

  @OneToMany(() => TypeormProductEntity, (product) => product.user)
  public products: TypeormProductEntity[]

  @Column({ 
    type: 'timestamp with time zone', 
    default: () => 'CURRENT_TIMESTAMP', 
  })
  public readonly createdAt: Date;
}