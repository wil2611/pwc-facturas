import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contexto = host.switchToHttp();
    const response = contexto.getResponse<Response>();
    const request = contexto.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    let errormessage: unknown = 'Internal server error';
    if (typeof message === 'string') {
      errormessage = message;
    } else if ('message' in message) {
      errormessage = message.message;
    }
    response.status(status).json({
      statusCode: status,
      path: request.url,
      message: errormessage,
    });
  }
}
