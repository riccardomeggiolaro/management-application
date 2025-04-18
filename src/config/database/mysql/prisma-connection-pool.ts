import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LRUCache } from 'lru-cache';

@Injectable()
export class PrismaConnectionPool implements OnModuleInit, OnModuleDestroy {
  private connectionPool: LRUCache<string, PrismaClient>;
  
  constructor(private configService: ConfigService) {
    // Configurazione del pool con LRU (Least Recently Used) cache
    this.connectionPool = new LRUCache({
      max: 50, // Numero massimo di connessioni simultanee nel pool
      ttl: 1000 * 60 * 30, // Time-to-live: 30 minuti di inattività prima della chiusura
      dispose: async (prismaClient: PrismaClient) => {
        // Chiusura della connessione quando viene rimossa dal pool
        await prismaClient.$disconnect();
      }
    });
  }

  async onModuleInit() {
    // Inizializzazione del pool con la connessione di default
  }

  async onModuleDestroy() {
    // Chiusura di tutte le connessioni nel pool
    const closePromises: Promise<void>[] = [];
    
    this.connectionPool.forEach((client) => {
      closePromises.push(client.$disconnect());
    });
    
    await Promise.all(closePromises);
    this.connectionPool.clear();
  }

  async getClient(connectionString: string): Promise<PrismaClient> {
    console.log(connectionString);
    // Controllo se la connessione esiste già nel pool
    if (!this.connectionPool.has(connectionString)) {
      // Creo nuova istanza di PrismaClient per questo database
      const prismaClient = new PrismaClient({
        datasources: {
          db: { url: connectionString },
        },
        log: this.configService.get('NODE_ENV') === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
      });
      
      // Inizializzazione della connessione
      await prismaClient.$connect();
      
      // Salvataggio nel pool
      this.connectionPool.set(connectionString, prismaClient);
    }
    
    // Restituisco l'istanza dal pool (aggiorna anche l'LRU)
    return this.connectionPool.get(connectionString)!;
  }
}