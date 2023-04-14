import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { StoresModule } from '../stores/stores.module'
import { StoreProduct, StoreProductSchema } from '../stores/model/product.model'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './model/product.model'
import { ClassificateProductsService } from './services/classificate/classificate-products.service'
import { CreateProductService } from './services/create/create-product.service'
import { GetProductsService } from './services/get/get-product.service'

@Module({
  imports: [
    StoresModule,
    MongooseModule.forFeature([
      { name: StoreProduct.name, schema: StoreProductSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ClassificateProductsService,
    CreateProductService,
    GetProductsService,
  ],
})
export class ProductsModule {}
