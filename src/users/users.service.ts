import { UsersEntity } from './users.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-users.dot';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { username } = createUser;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }
}
