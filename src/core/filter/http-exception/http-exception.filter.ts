/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express'; // 导入 Express 的 Response 类型

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus(); // 获取异常状态码

    // 处理验证错误
    let message = exception.message;
    if (status === HttpStatus.BAD_REQUEST) {
      const errorResponse = exception.getResponse();
      if (Array.isArray(errorResponse['message'])) {
        message = errorResponse['message'].join(';');
      }
    } else {
      message = message
        ? message
        : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    }
    const errorResponse = {
      data: {},
      message: message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
