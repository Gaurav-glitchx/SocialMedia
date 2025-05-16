import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module";
import { ValidationPipe } from "@nestjs/common";
// import { Transport } from "@nestjs/microservices";
// import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  // app.connectMicroservice({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: "user",
  //     protoPath: join(__dirname, "proto/user.proto"),
  //     url: "0.0.0.0:50051",
  //   },
  // });

  // await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(process.env.port ?? 3007);
}
bootstrap();
