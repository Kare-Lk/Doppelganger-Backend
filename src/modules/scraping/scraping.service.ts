import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer'
import { StoresService } from '../stores/stores.service'
import { ClassificateProductsService } from '../products/services/classificate/classificate-products.service'
@Injectable()
export class ScrapingService {
  constructor(
    private readonly storeService: StoresService,
    private readonly classificateProductService: ClassificateProductsService,
  ) {}

  STORE_TEST = {}

  async getStoreScraping() {
    console.log('init...')
    const browser = await puppeteer.launch({})
    console.log('launched browser')
    const results = []
    const stores = await this.storeService.getAllStores()
    console.log('stores', stores)
    for (const store of stores) {
      const page = await browser.newPage()
      const res = await this.initScraping(page, store)
      results.push(...res)
    }
    /*  const page = await browser.newPage()
    const results = await this.initScraping(page, this.STORE_TEST) */
    await browser.close()
    console.log('total Product Scraped: ', results.length)
    return results
  }

  async initScraping(page, storeData) {
    console.log('storeSelected: ', storeData.name)
    await page.goto(storeData.link)
    return await this.obtainProducts(page, storeData)
  }

  async obtainProducts(page, storeData) {
    console.log('obtaining products...')
    const processedProducts = []
    let url
    do {
      console.log('looped')
      const nextPageButton = await page.$(
        storeData.scraping_utils.next_page_selector,
      )
      if (nextPageButton !== null) {
        const href = await nextPageButton.getProperty('href')
        url = await href.jsonValue()
      } else {
        url = null
      }

      console.log('obtained next page button:', nextPageButton)

      console.log('url', url)

      const productsOnPage = await page.$$(
        storeData.scraping_utils.product_selector,
      )
      console.log('obtained products on page: ', productsOnPage.length)
      processedProducts.push(
        ...(await this.iterateProducts(productsOnPage, storeData)),
      )
      /* 
        La razón por la que itero los elemento acá y no fuera del do-while es porque 
        si lo hago fuera, el navegador se actualiza y ya no puedo acceder a los elementos
        de la página anterior 
      */
      if (!!url) {
        console.log('going to next page: ', url)
        /*  await nextPageButton.click() */
        await page.goto(url)
        /* 
          ahora no lo hago con el click, porque algunas tiendas dan problemas a la
          hora de hacer click en el botón de siguiente página
        */
      }
    } while (!!url)
    console.log('processedProducts: ', processedProducts.length)
    return processedProducts
  }

  async iterateProducts(products, storeData) {
    console.log('iterating products...')
    return await Promise.all(
      products.map(async (product) => {
        return await this.obtainProductDetails(product, storeData)
      }),
    )
  }

  async obtainProductDetails(product, storeData) {
    console.log("obtaining product's details...")
    const titleElement = await product.$(
      storeData.scraping_utils.product_title_selector,
    )
    const priceElement = await product.$(
      storeData.scraping_utils.product_price_selector,
    )
    const linkElement = await product.$(
      storeData.scraping_utils.product_link_selector,
    )
    const productTitle = await titleElement.evaluate((node) => node.textContent)
    const productPrice = await priceElement.evaluate((node) => node.textContent)
    const productLink = await linkElement.evaluate((node) => node.href)
    console.log('productInfo: ', {
      store_id: storeData._id,
      title: productTitle,
      price: productPrice,
      link: productLink,
    })
    await this.classificateProductService.clasificateProduct({
      store_id: storeData._id,
      title: productTitle,
      price: productPrice,
      link: productLink,
    })
    return { title: productTitle, price: productPrice, link: productLink }
  }
}
