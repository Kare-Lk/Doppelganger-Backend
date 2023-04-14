import { Model, Types } from 'mongoose'
import { StoresService } from 'src/modules/stores/stores.service'
import { GunplaGrade, Product } from '../../model/product.model'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { formatPriceToNumber } from 'src/common/helpers/helpers'
import { CreateProductService } from '../create/create-product.service'
import { GetProductsService } from '../get/get-product.service'
import * as stringSimilarity from 'string-similarity'
import { normalizeName } from 'src/common/helpers/normalize_name'

@Injectable()
export class ClassificateProductsService {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly storesService: StoresService,
    private readonly getProductService: GetProductsService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async clasificateProduct(product: {
    store_id: Types.ObjectId
    title: string
    price: string
    link: string
  }) {
    // pregunto por algún producto de tienda que tenga el mismo nombre
    const product_on_db = await this.storesService.getStoreProductByName(
      product.title,
    )

    if (!product_on_db) {
      try {
        let temp_product: {
          name?: string
          gunpla_grade?: string
          category?: string
        } = {}
        for (const grade of Object.values(GunplaGrade)) {
          // pregunto si en el nombre del producto está el nombre de la escala
          // de ser así se asume que es un gunpla y se crea el producto
          if (product.title.includes(grade)) {
            console.log('si es un gunpla')
            temp_product = {
              name: product.title,
              gunpla_grade: grade,
              category: 'gunpla',
            }
            //normalizeName elimina palabras viciosas
            const normalizedName = normalizeName(temp_product.name)
            console.log('normalizedName: ', normalizedName)

            //Busco todos los productos con el mismo grado
            const registered_products =
              await this.getProductService.findProduct(
                undefined,
                undefined,
                undefined,
                temp_product?.gunpla_grade,
              )

            for (const registered_product of registered_products) {
              const nameSimilarity = stringSimilarity.compareTwoStrings(
                registered_product.name,
                normalizedName,
              )
              console.log('nameSimilarity: ', nameSimilarity)
              // estudiando que similarity es la correcta
              if (nameSimilarity > 0.85) {
                const temp_store_product = {
                  name: temp_product.name,
                  normalized_name: normalizedName,
                  actual_price: formatPriceToNumber(product.price),
                  price_history: [
                    {
                      price: formatPriceToNumber(product.price),
                      date: new Date(),
                    },
                  ],
                  link: product.link,
                  available: true,
                  store_id: product.store_id,
                  product_id: registered_product._id,
                }
                return await this.storesService.createStoreProduct(
                  temp_store_product,
                )
              }
            }
            const { _id } = await this.createProductService.createProduct({
              ...temp_product,
              name: normalizedName,
            })
            const temp_store_product = {
              name: product.title,
              normalized_name: normalizedName,
              actual_price: formatPriceToNumber(product.price),
              price_history: [
                {
                  price: formatPriceToNumber(product.price),
                  date: new Date(),
                },
              ],
              link: product.link,
              available: true,
              store_id: product.store_id,
              product_id: _id,
            }
            return await this.storesService.createStoreProduct(
              temp_store_product,
            )
          }
        }
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
