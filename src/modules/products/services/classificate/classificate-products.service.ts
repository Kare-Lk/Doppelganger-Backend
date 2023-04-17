import { Types } from 'mongoose'
import { StoresService } from 'src/modules/stores/stores.service'
import { GunplaGrade } from '../../model/product.model'
import { Injectable } from '@nestjs/common'
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
      const updateStoreProduct = {
        actual_price: formatPriceToNumber(newProduct.price),
        price_history: [
          ...storeProductOnDB._doc.price_history,
          {
            price: formatPriceToNumber(newProduct.price),
            date: new Date(),
          },
        ],
      }
      return await this.storesService.updateStoreProduct(
        storeProductOnDB._doc._id,
        updateStoreProduct,
      )
    }

    // pregunto si en el nombre del producto está el nombre de la escala
    const grade = Object.values(GunplaGrade).find((grade) =>
      newProduct.title.includes(grade),
    )
    console.log('si es un gunpla de grado: ', grade)
    // si no tiene grade se asume que no es un gunpla
    if (!grade) return

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

    let result = undefined
    for (const registered_product of registered_products) {
      result = await this.isAlreadyOnStoreProduct(
        newProduct,
        registered_product,
        normalizedName,
      )
      if (result) return
    }
    if (result) return

    console.log('creating new product')
    const { _id } = await this.createProductService.createProduct({
      name: normalizedName,
      gunpla_grade: grade,
      category: 'gunpla',
    })

    console.log('creating new store product', _id)
    const createStoreProduct = {
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
    return await this.storesService.createStoreProduct(createStoreProduct)
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
    if (nameSimilarity < 0.84) return

    //  Si la similaridad es correcta, se crea el nuevo producto en la tienda tienda

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
