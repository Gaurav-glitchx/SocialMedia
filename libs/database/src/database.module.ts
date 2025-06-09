// libs/database/src/database.module.ts
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './mongoose.config';

@Global() // make this module globally available
@Module({
  imports: [MongooseModule.forRootAsync(mongooseConfig)],
  exports: [MongooseModule],
})
export class DatabaseModule {}
