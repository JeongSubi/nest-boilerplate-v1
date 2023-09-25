import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CustomTransformPipe } from '@common/pipe/CustomTransformPipe';

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new CustomTransformPipe());

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(8080);
}

bootstrap();
