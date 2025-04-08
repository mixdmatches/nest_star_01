import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  // 生成token
  createToken(user: Partial<UsersEntity>) {
    return this.jwtService.sign(user);
  }
  // 登录
  login(user: Partial<UsersEntity>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { token };
  }

  // 获取用户信息
  async getUser(user: UsersEntity) {
    if (!user) {
      return null;
    }
    const userInfo = await this.userRepository.findOne({
      where: { id: user.id },
    });
    return userInfo;
  }
}
