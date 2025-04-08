import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateLoginDto } from 'src/auth/dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersEntity } from 'src/users/users.entity';
@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('登录')
  @UseGuards(AuthGuard('local')) // 使用本地策略进行验证
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  login(@Body() user: CreateLoginDto) {
    return this.authService.login(user);
  }

  @ApiTags('获取用户信息')
  getUser(user: UsersEntity) {
    return this.authService.getUser(user);
  }
}
