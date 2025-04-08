import {
  Req,
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-users.dot';
import { UsersEntity } from 'src/users/users.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorators';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: [UsersEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @ApiTags('获取所有用户信息')
  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiTags('获取当前用户信息')
  @UseGuards(AuthGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  getMe(@Req() req: { user: UsersEntity }) {
    return req.user;
  }
}
