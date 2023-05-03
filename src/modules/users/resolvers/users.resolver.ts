import { Query, Resolver } from '@nestjs/graphql'
import { UsersService } from '../users.service'
import { User } from '../model/user.model'

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.getAllUsers()
  }
}
