import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { ScrapingModule } from '../scraping/scraping.module'
import { BlasterChileModule } from '../stores/blaster-chile/blaster-chile.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mongodb'),
    UsersModule,
    ScrapingModule,
    BlasterChileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
