import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Seeder } from 'nestjs-seeder'
import { generateStore } from 'src/modules/stores/fixture/store.fixture'
import { Store } from 'src/modules/stores/model/store.model'

@Injectable()
export class StoreSeed implements Seeder {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async seed(): Promise<any> {
    const arrayStore = generateStore()
    return this.storeModel.create(arrayStore)
  }

  async drop(): Promise<any> {
    return this.storeModel.deleteMany({})
  }
}
