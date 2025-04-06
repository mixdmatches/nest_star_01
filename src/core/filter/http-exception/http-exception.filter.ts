import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express'; // 导入 Express 的 Response 类型

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    // 明确指定 response 的类型为 Express.Response，避免使用隐式的 any 类型
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    // const message = exception.message
    //   ? exception.message
    //   : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    // const errorResponse = {
    //   data: {},
    //   message: message,
    //   code: -1,
    // };
    const errResponse = exception.getResponse();
    // 确保不修改 class-validator 的错误信息
    if (typeof errResponse === 'object' && 'message' in errResponse) {
      response.status(status).json(errResponse);
    } else {
      // 自定义响应码对应的信息
      const customMessage = this.getCustomMessage(status);
      response.status(status).json({
        statusCode: status,
        message: customMessage,
      });
    }
    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errResponse);
  }

  private getCustomMessage(status: number): string {
    switch (status) {
      case 200:
        return '请求成功';
      case 400:
        return '请求参数错误';
      case 500:
        return '服务器内部错误';
      default:
        return `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    }
  }
}
