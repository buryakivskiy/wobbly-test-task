import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ProductService } from './services/product.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductSchema } from './schemas/create-product.schema';
import { UpdateProductSchema } from './schemas/update-product.schema';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';
import { ProductEntityResponse } from './responses/product-entity.response';
import { ProductEntitiesResponse } from './responses/product-entities.response';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductEntitiesResponse })
  @ApiOperation({ description: 'Get products' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  public async getMany(): Promise<ProductEntitiesResponse> {
    const products = await this.productService.find();

    return new ProductEntitiesResponse(products);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductEntityResponse })
  @ApiOperation({ description: 'Get product by id' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  @ApiParam({
    name: 'id',
    type: 'number'
  })
  public async getById(@Param('id') id: number): Promise<ProductEntityResponse> {
    const product = await this.productService.findById(id);

    return new ProductEntityResponse(product);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductEntityResponse })
  @ApiOperation({ description: 'Create product' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  public async create(
    @User() user: IUserEntity,
    @Body() schema: CreateProductSchema
  ): Promise<ProductEntityResponse> {
    const product = await this.productService.create({
      ...schema,
      user,
    });

    return new ProductEntityResponse(product);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductEntityResponse })
  @ApiOperation({ description: 'Update product by id' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  @ApiParam({
    name: 'id',
    type: 'number'
  })
  public async update(
    @User() user: IUserEntity,
    @Param('id') id: number,
    @Body() schema: UpdateProductSchema,
  ): Promise<ProductEntityResponse> {
    const product = await this.productService.update({
      id,
      user,
      product: schema,
    });

    return new ProductEntityResponse(product);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ProductEntityResponse })
  @ApiOperation({ description: 'Delete product by id' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  @ApiParam({
    name: 'id',
    type: 'number'
  })
  public async delete(
    @User() user: IUserEntity,
    @Param('id') id: number
  ): Promise<ProductEntityResponse> {
    const product = await this.productService.delete(id, user);

    return new ProductEntityResponse(product);
  }
}