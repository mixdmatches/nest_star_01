import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-users.dot';
import { UsersEntity } from 'src/users/users.entity';
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
}
