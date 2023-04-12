import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ScrapingUtils, ScrapingUtilsSchema } from './scraping-utils.model'

@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class Store extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  link: string

  @Prop({ type: ScrapingUtilsSchema, required: true })
  scraping_utils: ScrapingUtils
}

export const StoreSchema = SchemaFactory.createForClass(Store)
StoreSchema.index({ create_at: -1 })
