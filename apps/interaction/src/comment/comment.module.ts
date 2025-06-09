import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrpcAuthModule } from '../common/guard/grpc-auth.module';
import { Comment, CommentSchema } from '../schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    GrpcAuthModule
  ],
  controllers: [],
  providers: []
})
export class CommentModule {}
