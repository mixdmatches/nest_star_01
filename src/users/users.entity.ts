import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100, default: 'default_nickname' })
  nickname: string; //昵称

  @Exclude() // 排除密码字段
  @Column()
  password: string; // 密码

  @Column({
    nullable: true,
  })
  avatar: string; //头像

  @Column({
    nullable: true,
  })
  email: string;

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string; // 用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
