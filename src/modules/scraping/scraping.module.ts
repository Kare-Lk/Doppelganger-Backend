import { Module } from '@nestjs/common'
import { ScrapingController } from './scraping.controller'
import { ScrapingService } from './scraping.service'
import { StoresModule } from '../stores/stores.module'
import { ClassificateProductsService } from '../products/services/classificate/classificate-products.service'
import { ProductsModule } from '../products/products.module'
import { CreateProductService } from '../products/services/create/create-product.service'
import { StoresService } from '../stores/stores.service'
import { GetProductsService } from '../products/services/get/get-product.service'
import { Product, ProductSchema } from '../products/model/product.model'
import { MongooseModule } from '@nestjs/mongoose'
import { StoreProduct, StoreProductSchema } from '../stores/model/product.model'
import { Store, StoreSchema } from '../stores/model/store.model'

@Module({
  imports: [
    StoresModule,
    ProductsModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: StoreProduct.name, schema: StoreProductSchema },
    ]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [ScrapingController],
  exports: [ScrapingService],
  providers: [
    ScrapingService,
    ClassificateProductsService,
    StoresService,
    CreateProductService,
    GetProductsService,
  ],
})
export class ScrapingModule {}
