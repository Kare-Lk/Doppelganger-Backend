import { Controller, Get } from '@nestjs/common'
import { BlasterChileService } from './blaster-chile.service'
import * as stringSimilarity from 'string-similarity'

@Controller('blaster-chile')
export class BlasterChileController {
  constructor(private readonly blasterChileService: BlasterChileService) {}

  @Get()
  getExample() {
    return stringSimilarity.compareTwoStrings('healed', 'sealed')
  }
}
