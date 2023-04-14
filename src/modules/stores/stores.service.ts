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
    return await this.storeModel.find()
  }

  async createStoreProduct(storeProduct): Promise<any> {
    const newStoreProduct = new this.StoreProduct(storeProduct)
    return await newStoreProduct.save()
  }

  async updateStoreProduct(storeProduct): Promise<any> {
    return await this.StoreProduct.findByIdAndUpdate(
      storeProduct._id,
      storeProduct,
    )
  }

  async getStoreProductById(id: string): Promise<any> {
    return await this.StoreProduct.findById(id)
  }

  async getStoreProductByName(name: string): Promise<any> {
    console.log('get store product by name', name)
    const regex = new RegExp(name, 'i') //la i es para que sea case insensitive
    return await this.StoreProduct.findOne({ name: regex }).exec()
  }
}
