import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  service?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;
  private readonly isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    this.isDevelopment =
      (process.env.NODE_ENV || this.configService.get<string>('app.nodeEnv')) ===
      'development';

    const consoleFormat = this.isDevelopment
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          }),
        )
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        );

    this.logger = winston.createLogger({
      level: this.isDevelopment ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
      ],
    });
  }

  log(message: string, context?: LogContext): void {
    void message;
    void context;
    // if (this.isDevelopment) {
    //   this.logger.info(message, context);
    // }
  }

  error(message: string, trace?: string, context?: LogContext): void {
    this.logger.error(message, { ...context, trace });
  }

  warn(message: string, context?: LogContext): void {
    void message;
    void context;
    // if (this.isDevelopment) {
    //   this.logger.warn(message, context);
    // }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.logger.debug(message, context);
    }
  }

  verbose(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.logger.verbose(message, context);
    }
  }

  // Custom methods for specific logging scenarios

  // API request logging
  apiRequest(
    method: string,
    url: string,
    userId?: string,
    requestId?: string,
  ): void {
    if (this.isDevelopment) {
      const context: LogContext = { method, url };
      if (userId) context.userId = userId;
      if (requestId) context.requestId = requestId;
      this.logger.info(`API Request: ${method} ${url}`, context);
    }
  }

  // API response logging
  apiResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
    requestId?: string,
  ): void {
    if (this.isDevelopment) {
      const context: LogContext = {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
      };
      if (userId) context.userId = userId;
      if (requestId) context.requestId = requestId;
      this.logger.info(
        `API Response: ${method} ${url} - ${statusCode}`,
        context,
      );
    }
  }

  // Authentication logging
  auth(
    event: 'login' | 'logout' | 'register' | 'token_refresh' | 'oauth_success',
    details?: Record<string, any>,
  ): void {
    if (this.isDevelopment) {
      const context: LogContext = { event, ...details };
      this.logger.info(`Auth: ${event}`, context);
    }
  }

  // Database operation logging
  database(
    operation: 'create' | 'read' | 'update' | 'delete',
    collection: string,
    documentId?: string,
    userId?: string,
  ): void {
    if (this.isDevelopment) {
      const context: LogContext = { operation, collection };
      if (documentId) context.documentId = documentId;
      if (userId) context.userId = userId;
      this.logger.debug(`Database: ${operation} ${collection}`, context);
    }
  }

  // User action logging
  userAction(
    action: string,
    userId: string,
    details?: Record<string, any>,
  ): void {
    if (this.isDevelopment) {
      const context: LogContext = { action, userId, ...details };
      this.logger.info(`User Action: ${action}`, context);
    }
  }

  // Error logging with full context
  errorWithContext(message: string, error: Error, context?: LogContext): void {
    this.logger.error(message, {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    if (this.isDevelopment) {
      const perfContext: LogContext = { ...context, duration: `${duration}ms` };
      this.logger.debug(`Performance: ${operation}`, perfContext);
    }
  }

  // Security event logging
  security(
    event: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded',
    details?: Record<string, any>,
  ): void {
    const context: LogContext = { event, ...details };
    this.logger.warn(`Security: ${event}`, context);
  }

  // HTTP request logging
  httpRequest(req: any, res: any, next?: any): void {
    void res;
    void next;
    if (this.isDevelopment) {
      const context: LogContext = {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?._id?.toString(),
      };
      this.logger.info(`HTTP Request: ${req.method} ${req.url}`, context);
    }
  }

  // HTTP response logging
  httpResponse(req: any, res: any, duration: number): void {
    if (this.isDevelopment) {
      const context: LogContext = {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?._id?.toString(),
      };
      this.logger.info(
        `HTTP Response: ${req.method} ${req.url} - ${res.statusCode}`,
        context,
      );
    }
  }
}
