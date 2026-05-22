import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017',
  dbName:
    process.env.MONGODB_DB_NAME || process.env.DB_NAME || 'portfolio',
}));
