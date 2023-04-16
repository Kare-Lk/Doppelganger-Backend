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

  async clasificateProduct(newProduct: {
    store_id: Types.ObjectId
    title: string
    price: string
    link: string
  }) {
    // pregunto por algún producto de tienda que tenga el mismo nombre
    const storeProductOnDB = await this.storesService.getStoreProductByName(
      newProduct.title,
    )

    /* 
      si existe el producto en la tienda, se actualiza el precio y
      se agrega el nuevo precio al historial 
    */
    if (storeProductOnDB) {
      const temp_product = {
        ...storeProductOnDB._doc,
        actual_price: formatPriceToNumber(newProduct.price),
        price_history: [
          ...storeProductOnDB._doc.price_history,
          {
            price: formatPriceToNumber(newProduct.price),
            date: new Date(),
          },
        ],
      }
      return await this.storesService.updateStoreProduct(temp_product)
    }

    for (const grade of Object.values(GunplaGrade)) {
      // pregunto si en el nombre del producto está el nombre de la escala
      // de ser así se asume que es un gunpla
      if (newProduct.title.includes(grade)) {
        console.log('si es un gunpla de grado', grade)
        /* 
          normalizeName elimina palabras viciosas como "bandai" y "hobby"
          para poder comparar de mejor manera los nombres de los productos
        */
        const normalizedName = normalizeName(newProduct.title)
        console.log('normalizedName: ', normalizedName)
        /* 
           Busco todos los productos con el mismo grado
        */
        const registered_products = await this.getProductService.findProduct(
          undefined,
          undefined,
          undefined,
          grade,
        )

        for (const registered_product of registered_products) {
          await this.isAlreadyOnStoreProduct(
            newProduct,
            registered_product,
            normalizedName,
          )
        }
        const { _id } = await this.createProductService.createProduct({
          name: normalizedName,
          gunpla_grade: grade,
          category: 'gunpla',
        })
        const temp_store_product = {
          name: newProduct.title,
          normalized_name: normalizedName,
          actual_price: formatPriceToNumber(newProduct.price),
          price_history: [
            {
              price: formatPriceToNumber(newProduct.price),
              date: new Date(),
            },
          ],
          link: newProduct.link,
          available: true,
          store_id: newProduct.store_id,
          product_id: _id,
        }
        return await this.storesService.createStoreProduct(temp_store_product)
      }
    }
  }

  async isAlreadyOnStoreProduct(newProduct, registeredProduct, normalizedName) {
    const storeAlreadyOnProduct = registeredProduct.store_products.some(
      (store) => store.store_id.toString() === newProduct.store_id.toString(),
    )
    console.log('is on the product: ', storeAlreadyOnProduct ? 'yes' : 'no')
    if (storeAlreadyOnProduct) return
    console.log('passed the store check')

    const nameSimilarity = stringSimilarity.compareTwoStrings(
      registeredProduct.name,
      normalizedName,
    )

    console.log('nameSimilarity: ', nameSimilarity)
    // estudiando que similarity es la correcta
    if (nameSimilarity > 0.85) {
      /* 
        Si la similaridad es correcta, se crea el nuevo producto en la tienda tienda
      */
      const newStoreProduct = {
        name: newProduct.title,
        normalized_name: normalizedName,
        actual_price: formatPriceToNumber(newProduct.price),
        price_history: [
          {
            price: formatPriceToNumber(newProduct.price),
            date: new Date(),
          },
        ],
        link: newProduct.link,
        available: true,
        store_id: newProduct.store_id,
        product_id: registeredProduct._id,
      }
      return await this.storesService.createStoreProduct(newStoreProduct)
    }
  }
}
