// Importa decoradores de NestJS
import { Injectable } from '@nestjs/common';

// Importa AuthGuard de @nestjs/passport para crear guards personalizados
import { AuthGuard } from '@nestjs/passport';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * LocalAuthGuard: Guard para proteger rutas que requieren autenticación con email/password
 * Usa la estrategia 'local' de Passport para validar credenciales
 * Se aplica con el decorador @UseGuards(LocalAuthGuard) en los endpoints de login
 */
export class LocalAuthGuard extends AuthGuard('local') {}
