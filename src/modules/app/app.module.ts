import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { ScrapingModule } from '../scraping/scraping.module'
import { StoresModule } from '../stores/stores.module'
import { ProductsModule } from '../products/products.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mongodb'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      buildSchemaOptions: {
        numberScalarMode: 'float',
      },
      driver: ApolloDriver,
      playground: true, //esto debiese cambiar dependiendo del entorno
      context: ({ req }) => req,
    }),
    UsersModule,
    ProductsModule,
    ScrapingModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
