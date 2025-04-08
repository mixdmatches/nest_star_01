import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth/constants';
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: () => {
    return {
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '4h' },
    };
  },
});
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), jwtModule],
  controllers: [UsersController],
  providers: [UserService, AuthGuard],
})
export class UsersModule {}
