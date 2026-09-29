import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './products.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private userService:UsersService
  ) {}

  async addProduct(userId: string, dto: CreateProductDto) {
    const total =
      dto.price + (dto.taxes ?? 0) + (dto.ads ?? 0) - (dto.discount ?? 0);
    const product = await this.productModel.create({
      ...dto,
      owner: userId,
      total,
    });
    return product;
  }

  //Get all products by this owner only
  async getProducts(userId: string, search?: string, by?: string) {
    const filter: Record<string, any> = { owner: userId };
    if (search?.trim()) {
      const field = by === 'category' ? 'category' : 'title';
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter[field] = { $regex: safe, $options: 'i' };
    }
    return this.productModel.find(filter).sort({ createdAt: -1 });
  }
  //Find specific product ONLY BY THIS OWNER
  async findProduct(userId: string, id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('product not found');
    }
    const exist = await this.productModel.findOne({ _id: id, owner: userId });
    if (!exist) {
      throw new NotFoundException('product not found');
    }
    return exist;
  }

  async updateProduct(userId: string, id: string, dto: UpdateProductDto) {
    const product = await this.findProduct(userId, id);
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );
    Object.assign(product, changes);
    product.total =
      product.price +
      (product.taxes ?? 0) +
      (product.ads ?? 0) -
      (product.discount ?? 0);
    return product.save();
  }

  async deleteProduct(userId: string, id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('product not found');
    }
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return {
      message: 'product deleted successfully',
    };
  }async deleteAllProducts(userId: string, password: string) {
  const user = await this.userService.findByIdWithPassword(userId);
  if (!user) {
    throw new UnauthorizedException('user not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('wrong password');
  }
  const result = await this.productModel.deleteMany({ owner: userId });
  return {
    message: 'all products deleted successfully',
    deletedCount: result.deletedCount,
  };
}
}
 
