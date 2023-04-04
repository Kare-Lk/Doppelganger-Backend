import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './services/create/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('creating user');
    return this.usersService.create(createUserDto);
  }

  @Get()
  getUserById(@Query('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
