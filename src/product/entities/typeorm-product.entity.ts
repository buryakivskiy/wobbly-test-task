import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { TypeormUserEntity } from 'src/user/entities/typeorm-user.entity';

@Entity('Product')
export class TypeormProductEntity implements IProductEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public description: string;

  @Column({ type: 'varchar' })
  public category: string;

  @Column({ type: 'int' })
  public price: number;

  @ManyToOne(() => TypeormUserEntity, (user) => user.products)
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