import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStorage } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// const jwtModule = JwtModule.register({
//   secret: 'test123456',
//   signOptions: { expiresIn: '4h' },
// });

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), PassportModule, jwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage],
  exports: [jwtModule], // 导出jwt模块
})
export class AuthModule {}
