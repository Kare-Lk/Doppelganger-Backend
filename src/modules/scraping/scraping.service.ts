import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer'
import { BlasterChileService } from '../stores/blaster-chile/blaster-chile.service'
import { MiraxService } from '../stores/mirax/mirax.service'
@Injectable()
export class ScrapingService {
  constructor(
    private readonly blasterChileService: BlasterChileService,
    private readonly miraxService: MiraxService,
  ) {}

  async initScraping() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // const res = await this.blasterChileService.initScrapingBlasterChile(page)
    const res = await this.miraxService.initScrapingMirax(page)
    await browser.close()

    return res
  }
}
