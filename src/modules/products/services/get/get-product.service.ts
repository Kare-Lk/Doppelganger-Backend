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
    name_product_store?: string,
    category?: string,
    gunpla_grade?: string,
    max_price?: number,
  ) {
    const products = await this.productModel
      .aggregate(
        findProductPipeline(
          name,
          name_product_store,
          category,
          gunpla_grade,
          max_price,
        ),
      )
      .exec()
    return products
  }
}
