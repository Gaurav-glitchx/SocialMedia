import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSession, UserSessionSchema } from './schema/user-session.schema';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '15m' },
    }),
    MongooseModule.forFeature([{ name: UserSession.name, schema: UserSessionSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
