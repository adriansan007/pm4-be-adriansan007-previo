import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Obtenemos el request de forma segura y lo tipamos explícitamente
    const req = context.switchToHttp().getRequest<Request>();

    // Verificamos que exista el header "authorization"
    const headerValue = req.headers['authorization'];
    if (typeof headerValue !== 'string') {
      throw new UnauthorizedException('Falta el header Authorization');
    }

    // Validamos el formato "Basic <email>:<password>"
    if (!headerValue.startsWith('Basic ')) {
      throw new UnauthorizedException('Formato de autorización inválido');
    }

    // Extraemos la parte que contiene las credenciales
    const credentialsPart = headerValue.slice(6).trim();

    // Split seguro
    const parts = credentialsPart.split(':');
    if (parts.length !== 2) {
      throw new UnauthorizedException(
        'El formato debe ser Basic <email>:<password>',
      );
    }

    const [email, password] = parts;

    // Validamos que ambos valores existan
    if (!email || !password) {
      throw new UnauthorizedException(
        'El header Authorization debe incluir email y password',
      );
    }

    // Si todo está correcto, se permite continuar
    return true;
  }
}
