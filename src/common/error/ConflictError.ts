import { ApolloError } from 'apollo-server-express';

export class ConflictError extends ApolloError {
  constructor(
    public message: string,
    public code: string,
    public desc?: Record<string, any>,
  ) {
    super(message, code, desc);

    Object.defineProperty(this, 'name', {
      value: 'ConflictError',
    });
  }
}
