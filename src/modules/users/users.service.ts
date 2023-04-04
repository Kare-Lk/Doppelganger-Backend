import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from './model/user.model'
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const newUser = await this.userModel.create(createUserDto)
      return newUser.save()
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.find()
      return users
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getUserById(userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId)
      return user
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteUserById(userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findByIdAndDelete(userId)
      return { ...user, deleted: true }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
