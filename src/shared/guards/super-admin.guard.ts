/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from './role';
import { User } from './user';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user; // Assuming you have user info attached to the request

        // Check if the user is an admin
        if (user && user.role === Role.SUPER_ADMIN) {
            return true;
        }

        throw new ForbiddenException('Permission denied: this operation is reserved for super administrators only.');        
    }
}