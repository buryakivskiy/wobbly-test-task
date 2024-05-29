import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export interface ICreateProduct {
    readonly name: string;

    readonly description: string;

    readonly category: string;

    readonly price: number;

    readonly user: IUserEntity;
}