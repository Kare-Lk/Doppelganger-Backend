import { Module } from '@nestjs/common'
import { ScrapingController } from './scraping.controller'
import { ScrapingService } from './scraping.service'
import { BlasterChileService } from '../stores/blaster-chile/blaster-chile.service'
import { BlasterChileModule } from '../stores/blaster-chile/blaster-chile.module'

@Module({
  imports: [BlasterChileModule],
  controllers: [ScrapingController],
  exports: [ScrapingService],
  providers: [ScrapingService, BlasterChileService],
})
export class ScrapingModule {}
