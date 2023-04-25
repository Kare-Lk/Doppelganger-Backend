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
    // pregunto por algún producto de tienda que tenga el mismo Link
    const storeProductOnDB = await this.storesService.getStoreProductByLink(
      newProduct.link,
    )

    //  si existe el producto en la tienda, se actualiza el precio y
    //  se agrega el nuevo precio al historial

    if (storeProductOnDB) {
      return await this.storesService.updateStoreProduct(
        storeProductOnDB._doc._id,
        {
          actual_price: formatPriceToNumber(newProduct.price),
          price_history: [
            ...storeProductOnDB._doc.price_history,
            {
              price: formatPriceToNumber(newProduct.price),
              date: new Date(),
            },
          ],
        },
      )
    }

    // por alguna razón está duplicando los products, hay que corregir

    // pregunto si en el nombre del producto está el nombre algun grade
    const grade = Object.values(GunplaGrade).find((grade) =>
      newProduct.title.toUpperCase().includes(grade),
    )

    // si no tiene grade se asume que no es un gunpla
    if (!grade) return

    //  normalizeName elimina palabras viciosas como "bandai" y "hobby"
    //  para poder comparar de mejor manera los nombres de los productos

    const normalizedName = normalizeName(newProduct.title)

    //  Busco todos los productos con el mismo grado
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

    const { _id } = await this.createProductService.createProduct({
      name: normalizedName,
      gunpla_grade: grade,
      category: 'gunpla',
    })

    return await this.storesService.createStoreProduct({
      name: newProduct.title,
      normalized_name: normalizedName,
      actual_price: formatPriceToNumber(newProduct.price),
      price_history: [
        {
          price: formatPriceToNumber(newProduct.price),
          date: new Date(),
        },
      ],
      link: newProduct.link.toString(),
      available: true,
      store_id: newProduct.store_id,
      product_id: _id,
    })
  }

  async isAlreadyOnStoreProduct(newProduct, registeredProduct, normalizedName) {
    const storeAlreadyOnProduct = registeredProduct.store_products.some(
      (store) => store.store_id.toString() === newProduct.store_id.toString(),
    )

    //  Si el nuevo storeProduct  pertenece a una tienda que ya tiene el producto
    //  se retorna y no se hace nada
    if (storeAlreadyOnProduct) return

    const nameSimilarity = stringSimilarity.compareTwoStrings(
      registeredProduct.name,
      normalizedName,
    )

    if (nameSimilarity < 0.84) return

    //  Se compruba la similaridad de nombre, si no es similar se retorna y no se hace nada
    return await this.storesService.createStoreProduct({
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
    })
  }
}
