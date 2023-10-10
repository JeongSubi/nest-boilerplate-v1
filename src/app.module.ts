import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@modules/users/users.module';
import { CommonModule } from '@common/common.module';
import { RoomsModule } from '@modules/rooms/rooms.module';
import { AuthModule } from '@src/auth/auth.module';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { AppService } from '@src/app.service';
import { UploadModule } from '@common/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env.prod',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: true,
      logging: ['error'],
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      fieldResolverEnhancers: ['guards', 'interceptors'],
      playground: process.env.NODE_ENV !== 'prod',
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams: any) => {
            return {
              token: connectionParams['Authorization'],
            };
          },
        },
      },
      cors: {
        origin: '*',
        credentials: true,
      },
      autoSchemaFile: true,
      context: ({ request, response }) => {
        return {
          authorization: request.headers.authorization,
          request,
          response,
        };
      },
    }),
    {
      ...JwtModule.register({
        secret: 'secret',
        signOptions: {
          expiresIn: '7d',
        },
      }),
      global: true,
    },
    UploadModule,
    UsersModule,
    CommonModule,
    RoomsModule,
    AuthModule,
    ReservationsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
