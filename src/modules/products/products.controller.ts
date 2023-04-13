import { Body, Controller, Get, Post } from '@nestjs/common'
import { ProductsService } from './products.service'
import { Types } from 'mongoose'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  createProductTest(
    @Body()
    product: {
      store_id: Types.ObjectId
      title: string
      price: string
      link: string
    },
  ) {
    return this.productsService.clasificateProducts(product)
  }
}
