import { MongooseModule } from '@nestjs/mongoose'
import { seeder } from 'nestjs-seeder'
import { Store, StoreSchema } from './modules/stores/model/store.model'
import { StoreSeed } from './seeds/stores.seed'

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mongodb'),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
}).run([StoreSeed])
