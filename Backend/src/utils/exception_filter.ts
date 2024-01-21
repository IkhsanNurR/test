import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from './customError';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (exception.name == 'SequelizeUniqueConstraintError') {
      const errormsg = exception.message;
      const seq = exception.errors[0]?.message;
      message = `${errormsg} ${seq}`;
    } else if (exception instanceof CustomError) {
      statusCode = exception.statusCode;
      message = exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
