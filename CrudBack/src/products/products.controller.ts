import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductsService } from './products.service';
import {
  Controller,
  UseGuards,
  Req,
  Body,
  Query,
  Param,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    return await this.productsService.addProduct(req.user._id, dto);
  }

  @Get()
  async getProducts(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('by') by?: string,
  ) {
    return await this.productsService.getProducts(req.user._id, search, by);
  }

  @Delete()
  async deleteAllProducts(@Req() req: any,@Body('password') password:string) {
    return await this.productsService.deleteAllProducts(req.user._id,password);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return await this.productsService.findProduct(req.user._id, id);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(req.user._id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return await this.productsService.deleteProduct(req.user._id, id);
  }
}
