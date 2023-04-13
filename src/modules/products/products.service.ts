import { Injectable } from '@nestjs/common'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { GunplaGrade, Product } from './model/product.model'
import { StoresService } from '../stores/stores.service'
import { formatPriceToNumber } from 'src/common/helpers/helpers'

@Injectable()
export class ProductsService {
  constructor(
    private readonly storesService: StoresService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async clasificateProducts(product: {
    store_id: Types.ObjectId
    title: string
    price: string
    link: string
  }) {
    console.log('product: ', product)

    const product_on_db = await this.storesService.getStoreProductByName(
      product.title,
    )
    console.log('product_on_db', product_on_db)

    if (!product_on_db) {
      try {
        let temp_product = {}
        for (const grade of Object.values(GunplaGrade)) {
          if (product.title.includes(grade)) {
            temp_product = {
              name: product.title,
              gunpla_grade: grade,
              category: 'gunpla',
            }
            break
          }
        }
        const { _id } = await this.createProduct(temp_product)
        const temp_store_product = {
          name: product.title,
          price_history: [
            { price: formatPriceToNumber(product.price), date: new Date() },
          ],
          link: product.link,
          available: true,
          store_id: product.store_id,
          product_id: _id,
        }
        return await this.storesService.creatStoreProduct(temp_store_product)
      } catch (error) {
        console.log('error on non-existing product', error)
        return error
      }
    } else {
      try {
        const temp_product = {
          ...product_on_db._doc,
          price_history: [
            ...product_on_db._doc.price_history,
            {
              price: formatPriceToNumber(product.price),
              date: new Date(),
            },
          ],
        }
        return await this.storesService.updateStoreProduct(temp_product)
      } catch (error) {
        console.log('error on existing product', error)
        return error
      }
    }
  }

  async createProduct(product) {
    const newProduct = new this.productModel(product)
    return await newProduct.save()
  }
}
