import { Module } from '@nestjs/common'
import { ScrapingController } from './scraping.controller'
import { ScrapingService } from './scraping.service'
import { StoresModule } from '../stores/stores.module'

@Module({
  imports: [StoresModule],
  controllers: [ScrapingController],
  exports: [ScrapingService],
  providers: [ScrapingService],
})
export class ScrapingModule {}
