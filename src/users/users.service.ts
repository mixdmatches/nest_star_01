import { UsersEntity } from './users.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-users.dot';
import { Repository } from 'typeorm';
import { classToPlain, plainToInstance } from 'class-transformer';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  /**
   * 注册
   * @param createUser
   * @returns
   */
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

  /**
   * 获取所有用户信息
   * @returns
   */
  async findAll() {
    // 去除password字段
    // 1.指明字段
    // const res = await this.userRepository.find({
    //   select: [
    //     'id',
    //     'username',
    //     'nickname',
    //     'avatar',
    //     'email',
    //     'role',
    //     'createTime',
    //     'updateTime',
    //   ],
    // });
    // 2. 使用queryBuilder
    // const res2 = await this.userRepository
    //   .createQueryBuilder('user')
    //   .select([
    //     'user.id',
    //     'user.username',
    //     'user.nickname',
    //     'user.avatar',
    //     'user.email',
    //     'user.role',
    //     'user.createTime',
    //     'user.updateTime',
    //   ])
    //   .getMany();

    // 3. 使用class-transformer
    const users = await this.userRepository.find();
    // 将从数据库查询得到的普通对象数组转换为 UsersEntity 类的实例数组
    const userInstances = users.map((user) =>
      plainToInstance(UsersEntity, user),
    );
    // 将 UsersEntity 类的实例数组转换为普通对象数组，并排除 @Exclude 装饰的字段
    const usersWithoutPassword = userInstances.map((user) =>
      classToPlain(user),
    );
    return usersWithoutPassword;
  }
}
