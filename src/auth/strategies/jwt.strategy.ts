// Importa ExtractJwt y Strategy de passport-jwt para manejar tokens JWT
import { ExtractJwt, Strategy } from 'passport-jwt';

// Importa PassportStrategy de NestJS para integrar Passport con NestJS
import { PassportStrategy } from '@nestjs/passport';

// Importa decoradores de NestJS
import { Injectable } from '@nestjs/common';

// Importa ConfigService para leer variables de entorno
import { ConfigService } from '@nestjs/config';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * JwtStrategy: Estrategia de autenticación usando tokens JWT
 * Extiende PassportStrategy para validar tokens JWT en las peticiones HTTP
 * Esta estrategia se usa para proteger rutas que requieren autenticación
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor que recibe ConfigService mediante inyección de dependencias
   * @param configService - Servicio para leer variables de entorno (.env)
   */
  constructor(private configService: ConfigService) {
    // Llama al constructor de la clase padre con la configuración de JWT
    super({
      // ExtractJwt.fromAuthHeaderAsBearerToken(): Extrae el token JWT del header Authorization
      // Busca el token en el formato: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // ignoreExpiration: false - Verifica que el token no haya expirado
      // Si es true, aceptaría tokens expirados (no recomendado)
      ignoreExpiration: false,
      
      // secretOrKey: La clave secreta para verificar la firma del token
      // Debe coincidir con la clave usada para firmar el token en el login
      // Usamos getOrThrow para asegurar que el valor no sea undefined
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  /**
   * Método validate: Es llamado automáticamente por Passport después de verificar el token
   * Este método recibe el payload decodificado del token JWT
   * 
   * @param payload - Objeto con los datos que se incluyeron en el token al firmarlo (email, sub, etc.)
   * @returns Objeto con información del usuario que estará disponible en req.user
   */
  async validate(payload: any) {
    // Retorna un objeto con la información del usuario extraída del token
    // payload.sub es el ID del usuario (estándar JWT para "subject")
    // payload.email es el email del usuario (incluido en el payload al crear el token)
    // Este objeto será accesible en los controladores como req.user
    return { userId: payload.sub, email: payload.email };
  }
}
