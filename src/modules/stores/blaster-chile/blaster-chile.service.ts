import { Injectable } from '@nestjs/common'

@Injectable()
export class BlasterChileService {
  async obtainProductDetails(product) {
    const titleElement = await product.$(
      '.product-block__title .product-block__title-link',
    )
    const priceElement = await product.$('.product-price .theme-money .money')
    const productTitle = await titleElement.evaluate((node) => node.textContent)
    const productPrice = await priceElement.evaluate((node) => node.textContent)
    const productLink = await titleElement.evaluate((node) => node.href)
    return { title: productTitle, price: productPrice, link: productLink }
  }

  async iterateProducts(products) {
    return await Promise.all(
      products.map(async (product) => {
        return await this.obtainProductDetails(product)
      }),
    )
  }

  async obtainProducts(page) {
    const processedProducts = []
    let nextPageButton
    do {
      nextPageButton = await page.$('span.next a')
      const productsOnPage = await page.$$('.product-block')
      processedProducts.push(...(await this.iterateProducts(productsOnPage)))
      /* 
        La razón por la que itero los elemento acá y no fuera del do-while es porque 
        si lo hago fuera, el navegador se actualiza y ya no puedo acceder a los elementos
        de la página anterior 
      */
      if (!!nextPageButton) {
        await nextPageButton.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
      }
    } while (!!nextPageButton)
    return processedProducts
  }
}
