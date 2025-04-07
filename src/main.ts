import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('文章管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // 在 Swagger 文档中添加直链
  const customOptions = {
    customSiteTitle: '文章管理后台 Swagger',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: 'https://nestjs.com/img/favicon.ico',
    customJs: [
      `window.onload = function() {
      const link = document.createElement('a');
      link.href = '/swagger.json';
      link.textContent = 'Download JSON';
      link.style.marginRight = '10px';
      document.querySelector('.swagger-ui .topbar-wrapper').appendChild(link);

      const yamlLink = document.createElement('a');
      yamlLink.href = '/swagger.yaml';
      yamlLink.textContent = 'Download YAML';
      document.querySelector('.swagger-ui .topbar-wrapper').appendChild(yamlLink);
    };`,
    ],
  };
  SwaggerModule.setup('docs', app, document, customOptions);
  // 保存OpenAPI规范文件
  fs.writeFileSync(
    path.join(process.cwd(), 'api.json'),
    JSON.stringify(document, null, 2),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
