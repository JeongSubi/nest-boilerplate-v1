import { ApolloError } from 'apollo-server-express';

export class NotFoundError extends ApolloError {
  constructor(public message: string, public code: string) {
    super(message, code);

    Object.defineProperty(this, 'name', {
      value: 'NotFoundError',
    });
  }
}
