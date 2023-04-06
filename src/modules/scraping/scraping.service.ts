import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer'
import { BlasterChileService } from '../stores/blaster-chile/blaster-chile.service'
@Injectable()
export class ScrapingService {
  constructor(private readonly blasterChileService: BlasterChileService) {}

  async initScraping() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const res = await this.blasterChileService.initScrapingBlasterChile(page)
    await browser.close()

    return res
  }
}
