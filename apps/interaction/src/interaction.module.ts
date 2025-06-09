import { Module } from '@nestjs/common';
<<<<<<< HEAD
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
=======
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';

@Module({
  imports: [],
  controllers: [InteractionController],
  providers: [InteractionService],
>>>>>>> 47630ffa150628610c32d87269338cf2219ac1d9
})
export class InteractionModule {}
