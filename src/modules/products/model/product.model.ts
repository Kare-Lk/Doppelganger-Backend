import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class Product extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  link: string

  @Prop()
  description: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.index({ create_at: -1 })
