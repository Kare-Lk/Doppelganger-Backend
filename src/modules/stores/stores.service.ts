import { Injectable } from '@nestjs/common'
import { Store } from './model/store.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async getAllStores(): Promise<any> {
    try {
      return await this.storeModel.find()
    } catch (error) {
      console.log('error', error)
      return error
    }
  }
}
