import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CustomTransformPipe } from '@common/pipe/CustomTransformPipe';

let application = null;

async function createApplication(): Promise<void> {
  application = await NestFactory.create(AppModule);
}

function onMiddlewareHandler(): void {
  application.use(cookieParser());
  application.useGlobalInterceptors(new ClassSerializerInterceptor(application.get(Reflector)));
  application.useGlobalPipes(new CustomTransformPipe());
}

function onNetworkHandler(): void {
  application.enableCors();
}

function onApplicationHandler(): void {
  application.enableShutdownHooks();
}

async function createServer(): Promise<void> {
  await application.listen(process.env.PORT || 8080);
  console.log(`$$ port open ========> ${process.env.PORT || 8080}`);
}

async function initialize(): Promise<void> {
  await createApplication();
  await onMiddlewareHandler();
  await onNetworkHandler();
  await onApplicationHandler();
  await createServer();
}

export async function bootstrap(): Promise<void> {
  await initialize();
}
