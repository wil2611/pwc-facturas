import {Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contexto = host.switchToHttp();
    const response = contexto.getResponse<Response>();
    const request = contexto.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';
    const errormessage = typeof message === 'string' ? message : (message as any).message || 'Internal server error';
    response.status(status).json({
      statusCode: status,
      path: request.url,
      message: errormessage
    });
  }
}