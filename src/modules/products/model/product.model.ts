import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum ProductCategory {
  Gunpla = 'gunpla',
  Accessory = 'accessory',
  Tool = 'tool',
  Other = 'other',
}
@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class Product extends Document {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    enum: Object.values(ProductCategory),
    default: ProductCategory.Other,
    index: true,
  })
  category: ProductCategory
}

export const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.index({ create_at: -1 })
