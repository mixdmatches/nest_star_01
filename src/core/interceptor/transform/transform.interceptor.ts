import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          // 明确指定 data 的类型，避免使用隐式的 any 类型
          data: data as unknown,
          code: 0,
          msg: '请求成功',
        };
      }),
    );
  }
}
