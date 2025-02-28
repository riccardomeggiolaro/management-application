import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AuthUser } from '@shared/decorators';
import { User } from '@shared/guards/user';
import { RequestPrismaService } from './request-prisma.service';

@Controller('materials')
export class MaterialsController {
  constructor(private prisma: RequestPrismaService) {}

  @Get()
  async getAllMaterials(@AuthUser() user: User) {
    // Use findMany() to query all materials from the database
    return this.prisma.materials.findMany();
  }
  
  // You might want to add additional endpoints for CRUD operations
  
  @Get('count')
  async getMaterialsCount(@AuthUser() user: User) {
    return this.prisma.materials.count();
  }

  @Post('register')
  async registerMaterial(@AuthUser() user: User) {
    return this.prisma.materials.create({data: {description: "wefjwfuou"}})
  }
}