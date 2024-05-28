import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PRODUCT_CONSTANTS } from '../product.constants';

export class UpdateProductSchema {
    @IsOptional()
    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.NAME.MAX_LENGTH)
    @ApiPropertyOptional()
    public readonly name?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.DESCRIPTION.MAX_LENGTH)
    @ApiPropertyOptional()
    public readonly description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(PRODUCT_CONSTANTS.DOMAIN.ENTITY.CATEGORY.MAX_LENGTH)
    @ApiPropertyOptional()
    public readonly category?: string;

    @IsOptional()
    @IsNumber()
    @Min(PRODUCT_CONSTANTS.DOMAIN.ENTITY.PRICE.MIN_VALUE)
    @ApiPropertyOptional()
    public readonly price?: number;
}