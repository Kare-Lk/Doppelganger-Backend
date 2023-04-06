import { Module } from '@nestjs/common'
import { MiraxController } from './mirax.controller'
import { MiraxService } from './mirax.service'

@Module({
  imports: [],
  controllers: [MiraxController],
  exports: [MiraxService],
  providers: [MiraxService],
})
export class MiraxModule {}
