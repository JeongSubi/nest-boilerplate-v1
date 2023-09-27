import { registerEnumType } from '@nestjs/graphql';

export enum TokenType {
  access = 'accessToken',
  refresh = 'refreshToken',
}

registerEnumType(TokenType, { name: 'TokenType' });
