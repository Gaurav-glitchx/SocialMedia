import { Module } from '@nestjs/common';
import { GrpcAuthGuard } from './common/guard/grpc-auth.guard';
import { ReactModule } from './react/react.module';
import { DatabaseModule } from '@libs/database';
import { GrpcAuthModule } from './common/guard/grpc-auth.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ReactModule,
    DatabaseModule,
    GrpcAuthModule,
    CommentModule
  ],
  providers: [GrpcAuthGuard]
})
export class InteractionModule {}
