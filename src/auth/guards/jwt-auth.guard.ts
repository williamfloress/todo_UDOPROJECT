// Importa decoradores de NestJS
import { Injectable } from '@nestjs/common';

// Importa AuthGuard de @nestjs/passport para crear guards personalizados
import { AuthGuard } from '@nestjs/passport';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * JwtAuthGuard: Guard para proteger rutas que requieren un token JWT válido
 * Usa la estrategia 'jwt' de Passport para validar tokens en el header Authorization
 * Se aplica con el decorador @UseGuards(JwtAuthGuard) en los endpoints protegidos
 * Si el token es inválido o no está presente, rechaza la petición con 401 Unauthorized
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}
