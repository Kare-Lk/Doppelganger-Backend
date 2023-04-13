import { Injectable } from '@nestjs/common'
import { Store } from './model/store.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StoreProduct } from './model/product.model'

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    @InjectModel(StoreProduct.name)
    private readonly StoreProduct: Model<StoreProduct>,
  ) {}

  async getAllStores(): Promise<any> {
    try {
      return await this.storeModel.find()
    } catch (error) {
      console.log('error', error)
      return error
    }
  }

  async creatStoreProduct(storeProduct): Promise<any> {
    console.log('createStoreProduct', storeProduct)
    try {
      const newStoreProduct = new this.StoreProduct(storeProduct)
      return await newStoreProduct.save()
    } catch (error) {
      console.log('error', error)
      return error
    }
  }

  async updateStoreProduct(storeProduct): Promise<any> {
    try {
      const res = await this.StoreProduct.findByIdAndUpdate(
        storeProduct._id,
        storeProduct,
      )
      return res
    } catch (error) {
      console.log('error', error)
      return error
    }
  }

  async getStoreProductById(id: string): Promise<any> {
    try {
      return await this.StoreProduct.findById(id)
    } catch (error) {
      console.log('error', error)
      return error
    }
  }

  async getStoreProductByName(name: string): Promise<any> {
    try {
      const regex = new RegExp(name, 'i') //la i es para que sea case insensitive
      return await this.StoreProduct.findOne({ name: regex }).exec()
    } catch (error) {
      console.log('error', error)
      return error
    }
  }
}
