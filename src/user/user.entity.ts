import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 100,
  })
  public email: string;

  @Column({ type: 'varchar' })
  public passwordHash: string;

  @Column({ 
    type: 'timestamp with time zone', 
    default: () => 'CURRENT_TIMESTAMP', 
  })
  public readonly createdAt: Date;
}