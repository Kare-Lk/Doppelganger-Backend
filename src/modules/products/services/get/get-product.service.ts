import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { Product } from '../../model/product.model'
import { InjectModel } from '@nestjs/mongoose'
import { findProductPipeline } from '../../pipelines/find-product.pipeline'

@Injectable()
export class GetProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findProduct(
    name?: string,
    category?: string,
    gunpla_grade?: string,
    price?: number,
  ) {
    const products = await this.productModel
      .aggregate(findProductPipeline(name, category, gunpla_grade, price))
      .exec()
    return products
  }
}
