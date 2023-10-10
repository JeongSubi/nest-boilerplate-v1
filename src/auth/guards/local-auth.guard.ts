import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    /**
     * graphql context로부터 input 가져오기
     */
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    request.body = ctx.getArgs().input;
    return request;
  }
}
