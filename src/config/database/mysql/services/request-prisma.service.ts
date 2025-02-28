import { Injectable, Inject, Scope, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { PrismaConnectionPool } from './prisma-connection-pool';
import { PrismaModelDelegate, PrismaModelDelegateMaterial } from '../prismaModelDelegate';

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
      const connectionString = this.request.user?.access_app?.application_tenant_db?.database_connection
        || process.env.DATABASE_URL;
      
      this.prismaClient = await this.connectionPool.getClient(connectionString);
      this.initialized = true;
    })();
    
    await this.initPromise;
  }

  // Define properties with proper type annotations
  get materials(): PrismaModelDelegateMaterial {
    return this.createModelProxy('materials');
  }
  
  // Helper method to create properly typed proxies
  private createModelProxy(modelName: string): PrismaModelDelegate {
    const service = this;
    
    return new Proxy({} as PrismaModelDelegate, {
      get(target, prop) {
        return async function(...args: any) {
          await service.initializeClient();
          
          if (!service.prismaClient) {
            throw new Error('PrismaClient not initialized');
          }
          
          const model = service.prismaClient[modelName];
          
          if (!model) {
            throw new Error(`Model ${modelName} does not exist on PrismaClient`);
          }
          
          const method = model[prop];
          
          if (typeof method !== 'function') {
            return method;
          }
          
          return method.apply(model, args);
        };
      }
    });
  }

  // For Prisma features that aren't model-specific
  async $transaction<P extends Prisma.PrismaPromise<any>[]>(operations: [...P]): Promise<any> {
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
    await this.initializeClient();
    if (!this.prismaClient) throw new Error('PrismaClient not initialized');
    return this.prismaClient.$executeRaw(query, ...values);
  }
}