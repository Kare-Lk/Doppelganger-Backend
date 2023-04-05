import { Module } from '@nestjs/common'
import { BlasterChileService } from './blaster-chile.service'
import { BlasterChileController } from './blaster-chile.controller'

@Module({
  imports: [],
  controllers: [BlasterChileController],
  exports: [BlasterChileService],
  providers: [BlasterChileService],
})
export class BlasterChileModule {}
