import { Prisma, materials } from "@prisma/client";

// Define types for model delegates to help TypeScript recognize methods
export class PrismaModelDelegate {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  findFirst: (args?: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
  // Add other Prisma methods you need
};

export class PrismaModelDelegateMaterial implements PrismaModelDelegate {
    findMany: (args?: Prisma.materialsFindManyArgs) => Promise<materials[]>;
    findUnique: (args?: Prisma.materialsFindUniqueArgs) => Promise<materials>;
    findFirst: (args?: Prisma.materialsFindFirstArgs) => Promise<materials>;
    create: (args: Prisma.materialsCreateArgs) => Promise<materials>;
    update: (args: Prisma.materialsUpdateArgs) => Promise<materials>;
    delete: (args: Prisma.materialsDeleteArgs) => Promise<materials>;
    count: (args?: Prisma.materialsCountArgs) => Promise<number>;
}