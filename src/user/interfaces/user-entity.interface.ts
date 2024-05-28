export interface IUserEntity {
  readonly id: number;

  email: string;

  passwordHash: string;

  readonly createdAt: Date;
}
