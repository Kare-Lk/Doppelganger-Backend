import { Module } from '@nestjs/common'
import { ScrapingController } from './scraping.controller'
import { ScrapingService } from './scraping.service'

@Module({
  imports: [],
  controllers: [ScrapingController],
  exports: [ScrapingService],
  providers: [ScrapingService],
})
export class ScrapingModule {}
