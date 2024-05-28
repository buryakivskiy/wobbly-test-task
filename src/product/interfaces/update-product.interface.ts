import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export interface IUpdateProduct {
    readonly id: number;

    readonly product: {
        readonly name?: string;

        readonly description?: string;

        readonly category?: string;

        readonly price?: number;
    }

    readonly user: IUserEntity;
}