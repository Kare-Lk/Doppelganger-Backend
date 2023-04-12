import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'

@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class StoreProduct extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: string

  @Prop({ required: true })
  link: string

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  })
  store_id: Types.ObjectId

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  product_id: Types.ObjectId
}

export const StoreProductSchema = SchemaFactory.createForClass(StoreProduct)
StoreProductSchema.index({ create_at: -1 })
