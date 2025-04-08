//jwt.strategy.ts
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { UsersEntity } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: { id: number }) {
    const exsitUser = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!exsitUser) {
      throw new UnauthorizedException('用户不存在');
    }
    return exsitUser;
  }
}
