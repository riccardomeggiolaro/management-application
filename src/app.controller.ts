import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthUser } from '@shared/decorators';
import { User } from '@shared/guards/user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@AuthUser() user: User): User {
    return user;
  }
}
