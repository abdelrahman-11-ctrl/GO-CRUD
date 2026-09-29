import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  taxes: number;

  @Prop({ default: 0 })
  ads: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop()
  total: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner:Types.ObjectId;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
