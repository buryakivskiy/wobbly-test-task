import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_CONSTANTS } from '../product.constants';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { TypeormUserEntity } from '../../user/entities/typeorm-user.entity';

@Entity('Product')
export class TypeormProductEntity implements IProductEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column({ 
    type: 'varchar',
    length: PRODUCT_CONSTANTS.DOMAIN.ENTITY.NAME.MAX_LENGTH
  })
  public name: string;

  @Column({ 
    type: 'varchar',
    length: PRODUCT_CONSTANTS.DOMAIN.ENTITY.DESCRIPTION.MAX_LENGTH
  })
  public description: string;

  @Column({ 
    type: 'varchar',
    length: PRODUCT_CONSTANTS.DOMAIN.ENTITY.CATEGORY.MAX_LENGTH
  })
  public category: string;

  @Column({ type: 'int' })
  public price: number;

  @ManyToOne(() => TypeormUserEntity, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: TypeormUserEntity

  @Column({ 
    type: 'timestamp with time zone', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  @Column({ 
    type: 'timestamp with time zone', 
    default: () => 'CURRENT_TIMESTAMP', 
  })
  public readonly createdAt: Date;
}