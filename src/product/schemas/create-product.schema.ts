import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { PRODUCT_CONSTANTS } from '../product.constants';

export class CreateProductSchema {
    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.NAME.MAX_LENGTH)
    @ApiProperty()
    public readonly name: string;
  
    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.DESCRIPTION.MAX_LENGTH)
    @ApiProperty()
    public readonly description: string;

    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.CATEGORY.MAX_LENGTH)
    @ApiProperty()
    public readonly category: string;

    @IsNumber()
    @Min(PRODUCT_CONSTANTS.DOMAIN.ENTITY.PRICE.MIN_VALUE)
    @ApiProperty()
    public readonly price: number;
}