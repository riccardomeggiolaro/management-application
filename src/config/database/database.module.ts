import type { Provider } from '@nestjs/common';

import { Module } from '@nestjs/common';
import { RequestPrismaService } from './mysql/services/request-prisma.service';
import { PrismaConnectionPool } from './mysql/services/prisma-connection-pool';
import { MaterialsController } from './mysql/prisma.controller';

const providers: Provider[] = [PrismaConnectionPool, RequestPrismaService];

@Module({
  providers,
  exports: [...providers],
  controllers: [MaterialsController]
})
export class DatabaseModule {}
