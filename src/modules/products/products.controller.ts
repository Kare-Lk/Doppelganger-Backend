import { Body, Controller, Get, Post } from '@nestjs/common'
import { Types } from 'mongoose'
import { ClassificateProductsService } from './services/classificate/classificate-products.service'
import { GetProductsService } from './services/get/get-product.service'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly classificateProductsService: ClassificateProductsService,
    private readonly getProductsService: GetProductsService,
  ) {}

  @Get('get')
  getProductsTest(
    @Body('name') name?: string,
    @Body('name_product_store') name_product_store?: string,
    @Body('category') category?: string,
    @Body('gunpla_grade') gunpla_grade?: string,
    @Body('max_price') max_price?: number,
  ) {
    return this.getProductsService.findProduct(
      name,
      name_product_store,
      category,
      gunpla_grade,
      max_price,
    )
  }

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
    return this.classificateProductsService.clasificateProduct(product)
  }
}
