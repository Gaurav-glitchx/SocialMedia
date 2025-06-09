import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.listen(process.env.port ?? 3006);
  console.log(`🚀 User Service is running at grpc port http://localhost:3006`);
}
bootstrap();
