import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { StoresModule } from '../stores/stores.module'
import { StoreProduct, StoreProductSchema } from '../stores/model/product.model'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './model/product.model'

@Module({
  imports: [
    StoresModule,
    MongooseModule.forFeature([
      { name: StoreProduct.name, schema: StoreProductSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
