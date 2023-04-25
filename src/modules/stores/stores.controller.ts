import { Body, Controller, Get } from '@nestjs/common'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('/get_all_stores')
  async getAllStores() {
    return await this.storesService.getAllStores()
  }

  @Get('get_product_by_link')
  async getProductByLink(@Body('link') link: string) {
    return await this.storesService.getStoreProductByLink(link)
  }
}
