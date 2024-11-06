import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data && (!user || !user?.[data])) {
      throw new Error('User not found or property not found');
    }

    return data ? user?.[data] : user;
  },
);
