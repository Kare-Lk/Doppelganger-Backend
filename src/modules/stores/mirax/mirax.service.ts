import { Injectable } from '@nestjs/common'

@Injectable()
export class MiraxService {
  async initScrapingMirax(page) {
    await page.goto(
      'https://www.mirax.cl/buscadorx.php?texto=gundam&fabrica=BANDAI&c=1&ordenx=4',
    )
    return await this.obtainProducts(page)
  }

  async obtainProductDetails(product) {
    const titleElement = await product.$(
      '.footer .footer-producto .descripcion-producto a',
    )
    console.log('titleElement: ', titleElement)
    const priceElement = await product.$('.text-center .precio a')
    console.log('priceElement: ', priceElement)
    const productTitle = await titleElement.evaluate((node) => node.textContent)
    const productPrice = await priceElement.evaluate((node) => node.textContent)
    const productLink = await titleElement.evaluate((node) => node.href)
    return { title: productTitle, price: productPrice, link: productLink }
  }

  async iterateProducts(productsOnPage) {
    return await Promise.all(
      productsOnPage.map(async (product) => {
        return await this.obtainProductDetails(product)
      }),
    )
  }

  async obtainProducts(page) {
    const processedProducts = []
    let nextPageButton
    do {
      nextPageButton = await page.$('li.prev-page > a.fa-angle-right')
      const productsOnPage = await page.$$('.cuerpo-footer')
      processedProducts.push(...(await this.iterateProducts(productsOnPage)))
      if (!!nextPageButton) {
        await nextPageButton.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
      }
    } while (!!nextPageButton)
    console.log('processedProducts: ', processedProducts.length)
    return processedProducts
  }
}
