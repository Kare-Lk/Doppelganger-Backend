import { Model, Types } from 'mongoose'
import { StoresService } from 'src/modules/stores/stores.service'
import { GunplaGrade, Product } from '../../model/product.model'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { formatPriceToNumber } from 'src/common/helpers/helpers'
import { CreateProductService } from '../create/create-product.service'

@Injectable()
export class ClassificateProductsService {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly storesService: StoresService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async clasificateProduct(product: {
    store_id: Types.ObjectId
    title: string
    price: string
    link: string
  }) {
    const product_on_db = await this.storesService.getStoreProductByName(
      product.title,
    )

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
        const { _id } = await this.createProductService.createProduct(
          temp_product,
        )
        const temp_store_product = {
          name: product.title,
          actual_price: formatPriceToNumber(product.price),
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
          actual_price: formatPriceToNumber(product.price),
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
}
