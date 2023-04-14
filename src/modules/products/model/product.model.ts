import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum ProductCategory {
  Gunpla = 'gunpla',
  Accessory = 'accessory',
  Tool = 'tool',
  Other = 'other',
}

export enum GunplaGrade {
  MasterGrade = 'MG',
  PerfectGrade = 'PG',
  RealGrade = 'RG',
  /*  RebornOneHundred = 'RE/100', */
  HighGrade = 'HG',
  /*  HighGradeUniversalCentury = 'HGUC',
  SDBBSenshi = 'SD', */
}
@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class Product extends Document {
  @Prop({ required: true })
  name: string

  @Prop({
    required: false,
    enum: Object.values(GunplaGrade),
  })
  gunpla_grade?: GunplaGrade

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
