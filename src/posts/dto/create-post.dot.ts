// dto/create-post.dot.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  @ApiProperty({ description: '文章标题' })
  readonly title: string;

  @IsNotEmpty({ message: '文章作者不能为空' })
  @ApiProperty({ description: '文章作者' })
  readonly author: string;

  @IsNotEmpty({ message: '文章内容不能为空' })
  @ApiProperty({ description: '文章内容' })
  readonly content: string;

  @ApiProperty({ description: '文章封面' })
  readonly cover_url: string;

  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}
