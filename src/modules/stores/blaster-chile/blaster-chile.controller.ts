import { Controller } from '@nestjs/common'
import { BlasterChileService } from './blaster-chile.service'

@Controller('blaster-chile')
export class BlasterChileController {
  constructor(private readonly blasterChileService: BlasterChileService) {}
}
