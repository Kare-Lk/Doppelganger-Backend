import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: false, _id: false })
export class ScrapingUtils extends Document {
  @Prop()
  next_page_selector: string

  @Prop()
  product_selector: string

  @Prop()
  product_title_selector: string

  @Prop()
  product_price_selector: string

  @Prop()
  product_link_selector: string
}

export const ScrapingUtilsSchema = SchemaFactory.createForClass(ScrapingUtils)
