import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Types } from 'mongoose'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  getUserById(@Query('_id') _id: Types.ObjectId) {
    return this.usersService.getUserById(_id)
  }

  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers()
  }

  @Get('delete')
  deleteUserById(@Query('_id') _id: Types.ObjectId) {
    return this.usersService.deleteUserById(_id)
  }
}
