import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { PostsEntity } from './posts/posts.entity';
import { UsersEntity } from 'src/users/users.entity';
// import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity, UsersEntity], // 数据表实体
        host: configService.get<string>('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '230203'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), // 数据库名
        timezone: '+08:00', // 服务器上配置的时区
        synchronize: true, // 根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    PostsModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET'),
    //     signOptions: { expiresIn: '10h' },
    //   }),
    //   inject: [ConfigService],
    // }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
