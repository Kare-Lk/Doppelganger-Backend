import { Injectable } from '@nestjs/common'
import { Product } from '../../model/product.model'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class CreateProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(product) {
    const newProduct = new this.productModel(product)
    return await newProduct.save()
  }
}
