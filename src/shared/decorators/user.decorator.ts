import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { createParamDecorator } from '@nestjs/common';
import { User } from '@shared/guards/user';

export const AuthUser: (...dataOrPipes: unknown[]) => ParameterDecorator =
  createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
    const request: Request & { user: User } = ctx.switchToHttp().getRequest();

    return request.user;
});