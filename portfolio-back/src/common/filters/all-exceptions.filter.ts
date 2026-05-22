import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  GENERIC_ERROR_BODY,
  PAYLOAD_TOO_LARGE_USER_MESSAGE,
} from '../constants/payload.constants';
import { WinstonLoggerService } from '../utils/logger/winston-logger.service';

const TECHNICAL_ROUTE_MESSAGE =
  /^Cannot (GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s/i;

function sanitizeHttpMessage(message: string, status: number): string {
  if (TECHNICAL_ROUTE_MESSAGE.test(message)) {
    if (status === HttpStatus.NOT_FOUND) {
      return 'This action is not available right now. Please try again later.';
    }
    return 'Something went wrong. Please try again.';
  }
  return message;
}

function isPayloadTooLarge(exception: unknown): boolean {
  if (!exception || typeof exception !== 'object') return false;
  const err = exception as Record<string, unknown>;
  if (err.status === 413 || err.statusCode === 413) return true;
  if (err.type === 'entity.too.large') return true;
  if (err.name === 'PayloadTooLargeError') return true;
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_BODY_LENGTH')
    return true;
  return false;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (isPayloadTooLarge(exception)) {
      const detail =
        exception instanceof Error
          ? exception.stack || exception.message
          : JSON.stringify(exception);
      this.logger.error('Request payload too large', detail);
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        ...GENERIC_ERROR_BODY,
        message: PAYLOAD_TOO_LARGE_USER_MESSAGE,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string | string[] })?.message ||
            'An error occurred';
      const text = Array.isArray(message) ? message.join(', ') : message;
      return response.status(status).json({
        success: false,
        error: true,
        message: sanitizeHttpMessage(String(text), status),
      });
    }

    const detail =
      exception instanceof Error
        ? exception.stack || exception.message
        : String(exception);
    this.logger.error('Unhandled exception', detail);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: 'Something went wrong. Please try again.',
    });
  }
}
