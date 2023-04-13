import { Module } from '@nestjs/common'
import { StoresService } from './stores.service'
import { StoresController } from './stores.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Store, StoreSchema } from './model/store.model'
import { StoreProduct, StoreProductSchema } from './model/product.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StoreProduct.name, schema: StoreProductSchema },
    ]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [StoresController],
  exports: [StoresService],
  providers: [StoresService],
})
export class StoresModule {}
