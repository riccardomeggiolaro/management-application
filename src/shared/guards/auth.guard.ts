import { IS_PUBLIC_KEY } from '@core/constants';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AccessApp, ApplicationFunctionalData, ApplicationFunctionalDataExample } from './user';

@Injectable()
export class HttpGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private httpService: HttpService,
        private configService: ConfigService
    ) {}

    getApplicationByCode(user: any, code: string): AccessApp | null {
        return user.access_app?.find(app => 
            app.application_tenant_db?.application?.code === code
        ) ?? null;
    }   

    hasSameAttributes(obj: any): boolean {
        if (typeof obj !== "object" || obj === null) return false;
      
        const referenceKeys = Object.keys(new ApplicationFunctionalDataExample());

        return referenceKeys.every(key => key in obj);
    }
          
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const endpoint: string = this.configService.get<string>('API_AUTH_PROFILE')!;
        const appCode: string = this.configService.get<string>('APP_CODE')!;

        try {
            // Effettua la richiesta GET usando HttpService
            const accessApp = await lastValueFrom(
                this.httpService.get(endpoint, {
                    headers: { Authorization: authHeader },
                })
            );

            if (!accessApp) throw new UnauthorizedException('You are not enable to access on this app');

            const appplicationFunctionalData: ApplicationFunctionalData = JSON.parse(accessApp.data.applicationFunctionalData as string);

            if (!this.hasSameAttributes(appplicationFunctionalData)) throw new UnauthorizedException(`Your applicationFunctionalData are not correct. Your data is: ${JSON.stringify(appplicationFunctionalData)}. Exptected example is: ${JSON.stringify(new ApplicationFunctionalDataExample())}`);

            request.user = accessApp.data;

            return true;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                // Rilancia lo stesso errore ricevuto dall'API di autenticazione
                throw new HttpException(error.response.data, error.response.status);
            }
            // Se l'errore non ha una risposta HTTP, lancia un generico Unauthorized
            throw new UnauthorizedException(error.response.message || 'Authentication service unavailable');
        }
    }
}