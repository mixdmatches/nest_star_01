// local.strategy.ts
import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UsersEntity } from 'src/users/users.entity';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();

    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }
    return user;
  }
}
