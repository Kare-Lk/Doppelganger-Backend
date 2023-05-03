import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from './model/user.model'
import { UsersResolver } from './resolvers/users.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
