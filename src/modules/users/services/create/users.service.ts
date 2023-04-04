import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users = [];

  create(createUserDto: CreateUserDto) {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    return this.users.find((user) => user.id == id);
  }
}
