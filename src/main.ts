import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  app.enableCors()

  await app.listen(4001)
}
bootstrap()
