import { Injectable } from '@nestjs/common'
import { chromium } from 'playwright'

@Injectable()
export class ScrapingService {
  async getScraping() {
    const browser = await chromium.launch()
    return 'Scraping'
  }
}
