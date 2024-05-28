export interface ICreateUser {
  readonly email: string;
  
  readonly passwordHash: string;
}