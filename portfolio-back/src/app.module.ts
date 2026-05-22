import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './common/utils/logger/logger.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [databaseConfig, appConfig],
      envFilePath: [
        `src/env/env.${process.env.NODE_ENV || 'development'}`,
        'src/env/env.development',
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        const mongoDbName =
          process.env.MONGODB_DB_NAME || process.env.DB_NAME;
        if (process.env.NODE_ENV === 'production') {
          if (!mongoUri) {
            throw new Error(
              'MONGODB_URI (or MONGO_URI) environment variable is required in production',
            );
          }
          if (!mongoDbName) {
            throw new Error(
              'MONGODB_DB_NAME (or DB_NAME) environment variable is required in production',
            );
          }
        }

        return {
          uri: configService.get<string>('database.uri'),
          dbName: configService.get<string>('database.dbName'),
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    HealthModule,
  ],
})
export class AppModule {}
