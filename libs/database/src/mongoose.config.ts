import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleAsyncOptions = {
  useFactory: async () => ({
    // uri: process.env.MONGO_URI || 'mongodb://localhost:27017/social_media',
    uri:'mongodb+srv://akshatsrivastava1:5mFEh9m2Xq3OMZh2@cluster0.cskfle2.mongodb.net/',
    dbName: process.env.DB_NAME || 'social_media',
  }),
};