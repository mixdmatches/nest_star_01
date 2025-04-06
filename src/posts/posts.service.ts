import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { CreatePostDto } from './dto/create-post.dot';
export interface PostsRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  // 创建文章
  async create(post: CreatePostDto): Promise<PostsEntity> {
    const { title } = post;
    console.log(post);

    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }

  // 获取文章列表
  async findAll(query): Promise<PostsRo> {
    // 旧版本api用法
    // const qb = getRepository(PostsEntity).createQueryBuilder('post');
    // 新版本api用法
    const qb = this.postsRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    // 明确指定query的类型为Record<string, any>，以解决不安全赋值的问题
    const {
      pageNum = 1,
      pageSize = 10,
      ...params
    } = query as Record<string, number>;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    console.log(params);
    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id: number): Promise<PostsEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return post;
  }

  // 更新文章
  async updateById(id: number, post: CreatePostDto): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id: number) {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
