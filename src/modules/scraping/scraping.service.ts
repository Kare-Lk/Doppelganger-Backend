import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer'
import { BlasterChileService } from '../stores/blaster-chile/blaster-chile.service'
@Injectable()
export class ScrapingService {
  constructor(private readonly blasterChileService: BlasterChileService) {}

  async getScraping() {
    const browser = await puppeteer.launch()
    console.log('init...')
    const page = await browser.newPage()
    console.log('goin to...')
    await page.goto('https://www.blasterchile.cl/collections/model-kit/Gundam')

    const res = await this.blasterChileService.obtainProducts(page)
    console.log('res', res)
    await browser.close()

    return res
  }
}
