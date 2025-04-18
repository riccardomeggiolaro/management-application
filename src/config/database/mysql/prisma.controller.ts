import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from '@shared/decorators';
import { User } from '@shared/guards/user';
import { RequestPrismaService } from './request-prisma.service';
import { IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  description: string;

  @IsString()
  code: string;

  @IsString()
  imei: string;
}

@Controller('installation')
export class MaterialsController {
  constructor(private prisma: RequestPrismaService) {}

  @Get('list')
  async getAllMaterials(@AuthUser() user: User) {
    console.log(`controller: ${user.database_connection}`);
    // Use findMany() to query all materials from the database
    return this.prisma.installation.findMany();
  }
  
  // You might want to add additional endpoints for CRUD operations
  
  @Get('count')
  async getMaterialsCount(@AuthUser() user: User) {
    return this.prisma.installation.count();
  }

  @Post('register')
  async registerMaterial(@AuthUser() user: User, @Body() data: RegisterDTO) {
    return this.prisma.installation.create({data});
  }

  @Delete(':id')
  async delete(@AuthUser() user: User, @Param('id') id: number) {
    return this.prisma.installation.delete({where: {id}})
  }
}