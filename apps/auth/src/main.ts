import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../proto/user.proto'),
      url: '0.0.0.0:5000',
      loader: {
        keepCase: true, // <- this is critical
      },
    },
  });

  await app.listen();
  console.log(`🚀 Auth Service is running at grpc port 0.0.0.0:5000`);
  // console.log(`📚 Swagger docs available at http://localhost:3000/api`);
}
bootstrap();
