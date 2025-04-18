import { Injectable, Inject, Scope, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { PrismaConnectionPool } from './prisma-connection-pool';

@Injectable({ scope: Scope.REQUEST })
export class RequestPrismaService implements OnModuleInit {
  private prismaClient: PrismaClient | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(
    private connectionPool: PrismaConnectionPool,
    @Inject(REQUEST) private request: any,
  ) {}

  async onModuleInit(): Promise<void> {
    // Initialize on-demand
  }

  private async initializeClient(): Promise<void> {
    if (this.initialized && this.prismaClient) return;
    
    // If initialization is already in progress, wait for it
    if (this.initPromise) {
      await this.initPromise;
      return;
    }
    
    // Start initialization
    this.initPromise = (async () => {
      const connectionString = this.request.user?.database_connection || process.env.DATABASE_URL;
      
      this.prismaClient = await this.connectionPool.getClient(connectionString);
      this.initialized = true;
    })();
    
    await this.initPromise;
  }

  // Define properties with proper type annotations for Prisma 6.x
  get installation() {
    return this.createModelProxy<Prisma.InstallationDelegate>('installation');
  }

  get raw() {
    return this.createModelProxy<Prisma.rawDelegate<any>>('raw');
  }

  get event() {
    return this.createModelProxy<Prisma.EventDelegate<any>>('event');
  }
  
  // Helper method to create properly typed proxies
  private createModelProxy<T extends object>(modelName: string): T {
    const service = this;
    return new Proxy({} as T, {
      get(target, prop) {
        return async function(...args: any[]) {
          await service.initializeClient();
          if (!service.prismaClient) {
            throw new Error('PrismaClient not initialized');
          }
          
          const model = service.prismaClient[modelName as keyof PrismaClient];
          if (!model) {
            throw new Error(`Model ${modelName} does not exist on PrismaClient`);
          }
          
          const method = model[prop as keyof typeof model];
          if (typeof method !== 'function') {
            return method;
          }
          
          return (method as (...args: any[]) => any).apply(model, args);
        };
      }
    });
  }

  // For Prisma features that aren't model-specific
  async $transaction<P extends Prisma.PrismaPromise<any>[]>(operations: [...P]): Promise<any[]> {
    await this.initializeClient();
    if (!this.prismaClient) throw new Error('PrismaClient not initialized');
    return this.prismaClient.$transaction(operations);
  }

  async $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Promise<T> {
    await this.initializeClient();
    if (!this.prismaClient) throw new Error('PrismaClient not initialized');
    return this.prismaClient.$queryRaw<T>(query, ...values);
  }

  async $executeRaw(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Promise<number> {
    await this.initializeInit();
    if (!this.prismaClient) throw new Error('PrismaClient not initialized');
    return this.prismaClient.$executeRaw(query, ...values);
  }

  // Fixed typo in the method name
  private async initializeInit(): Promise<void> {
    return this.initializeClient();
  }
}