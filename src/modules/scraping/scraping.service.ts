import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer'
@Injectable()
export class ScrapingService {
  STORE_LIST = [
    {
      name: 'Mirax',
      url: 'https://www.mirax.cl/buscadorx.php?texto=gundam&fabrica=BANDAI&c=1&ordenx=4',
      nextPageSelector: 'li.prev-page > a.fa-angle-right',
      productSelector: '.cuerpo-footer',
      productTitleSelector: '.footer .footer-producto .descripcion-producto a',
      productPriceSelector: '.text-center .precio a',
      productLinkSelector: '.footer .footer-producto .descripcion-producto a',
    },
    {
      name: 'Blaster Chile',
      url: 'https://www.blasterchile.cl/collections/model-kit/Gundam',
      nextPageSelector: 'span.next a',
      productSelector: '.product-block',
      productTitleSelector: '.product-block__title .product-block__title-link',
      productPriceSelector: '.product-price .theme-money .money',
      productLinkSelector: '.product-block__title .product-block__title-link',
    },
    {
      name: 'Irion',
      url: 'https://irion.cl/marcas/gundam/page/1/?orderby=price-desc&stock=instock',
      nextPageSelector: '.next.page-numbers',
      productSelector: 'li.product',
      productTitleSelector: 'h2.woocommerce-loop-product__title',
      productPriceSelector: '.woocommerce-Price-amount.amount bdi',
      productLinkSelector:
        'div.product-loop-header a.woocommerce-LoopProduct-link',
    },
    {
      name: 'Hangar019',
      url: 'https://www.hangar019.cl/8-gunpla?marca=bandai&en-stock=1&orderby=price&orderway=desc',
      nextPageSelector: 'li.pagination_next a',
      productSelector: '.right-block',
      productTitleSelector: '.product-name-container a.product-name',
      productPriceSelector: '.content_price .price',
      productLinkSelector: '.product-name-container a.product-name',
    },
  ]

  async getStoreScraping() {
    const browser = await puppeteer.launch()
    console.log('init...')
    const results = []
    for (const store of this.STORE_LIST) {
      const page = await browser.newPage()
      const res = await this.initScraping(page, store)
      results.push(...res)
    }
    /*  const page = await browser.newPage()
    const results = await this.initScraping(page, this.STORE_LIST[3]) */
    await browser.close()
    return results
  }

  async initScraping(page, storeData) {
    console.log('storeSelected: ', storeData.name)
    await page.goto(storeData.url)
    return await this.obtainProducts(page, storeData)
  }

  async obtainProducts(page, storeData) {
    console.log('obtaining products...')
    const processedProducts = []
    let url
    do {
      console.log('looped')
      const nextPageButton = await page.$(storeData.nextPageSelector)
      if (nextPageButton !== null) {
        const href = await nextPageButton.getProperty('href')
        url = await href.jsonValue()
      } else {
        url = null
      }

      console.log('obtained next page button:', nextPageButton)

      console.log('url', url)

      const productsOnPage = await page.$$(storeData.productSelector)
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
    const titleElement = await product.$(storeData.productTitleSelector)
    const priceElement = await product.$(storeData.productPriceSelector)
    const linkElement = await product.$(storeData.productLinkSelector)
    const productTitle = await titleElement.evaluate((node) => node.textContent)
    const productPrice = await priceElement.evaluate((node) => node.textContent)
    const productLink = await linkElement.evaluate((node) => node.href)
    console.log('askljdlkas', {
      title: productTitle,
      price: productPrice,
      link: productLink,
    })
    return { title: productTitle, price: productPrice, link: productLink }
  }
}
