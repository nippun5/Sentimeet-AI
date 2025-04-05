import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor( private readonly configService: ConfigService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private validateRequest(request): boolean {
        return this.isLoggedIn(request);
    }

    isLoggedIn(request): boolean {
        console.log(request.headers,"authrization");
        const token = request.headers.authorization?.split(' ')[1]; // Get token from Bearer token

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const decoded = this.verifyToken(token);
            if (!decoded) {
                throw new UnauthorizedException('Invalid token');
            }
            // Optionally attach user to request object for further processing
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    // Method to verify JWT token
    private verifyToken(token: string) {
        const secret = this.configService.get<string>('JWT_SECRET');
        return jwt.verify(token, secret); // Verifies the token using the secret
    }
}
