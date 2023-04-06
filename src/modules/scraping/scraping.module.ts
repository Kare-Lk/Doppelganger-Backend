import { Module } from '@nestjs/common'
import { ScrapingController } from './scraping.controller'
import { ScrapingService } from './scraping.service'
import { BlasterChileService } from '../stores/blaster-chile/blaster-chile.service'
import { BlasterChileModule } from '../stores/blaster-chile/blaster-chile.module'
import { MiraxService } from '../stores/mirax/mirax.service'
import { MiraxModule } from '../stores/mirax/mirax.module'

@Module({
  imports: [BlasterChileModule, MiraxModule],
  controllers: [ScrapingController],
  exports: [ScrapingService],
  providers: [ScrapingService, BlasterChileService, MiraxService],
})
export class ScrapingModule {}
