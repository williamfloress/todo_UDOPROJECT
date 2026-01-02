// Importa decoradores y módulos de NestJS
import { Module } from '@nestjs/common';

// Importa JwtModule para configurar la generación y validación de tokens JWT
import { JwtModule } from '@nestjs/jwt';

// Importa PassportModule para integrar estrategias de autenticación
import { PassportModule } from '@nestjs/passport';

// Importa ConfigModule y ConfigService para leer variables de entorno
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importa los componentes del módulo de autenticación
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Importa UsersModule para acceder al servicio de usuarios
import { UsersModule } from '../users/users.module';

// Importa las estrategias de autenticación
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule: Módulo que centraliza toda la configuración de autenticación
 * Configura JWT, Passport, estrategias y servicios necesarios para autenticación
 */
@Module({
  imports: [
    // UsersModule: Necesario para que AuthService pueda usar UsersService
    UsersModule,
    
    // PassportModule: Habilita el uso de estrategias de Passport
    PassportModule,
    
    // JwtModule.registerAsync: Configura el módulo JWT de forma asíncrona
    // registerAsync permite usar ConfigService para leer variables de entorno
    JwtModule.registerAsync({
      // Importa ConfigModule para que ConfigService esté disponible
      imports: [ConfigModule],
      
      // useFactory: Función que retorna la configuración del módulo JWT
      useFactory: (configService: ConfigService) => ({
        // secret: Clave secreta para firmar y verificar tokens JWT
        // Se obtiene de la variable de entorno JWT_SECRET
        secret: configService.get('JWT_SECRET'),
        
        // signOptions: Opciones para firmar tokens
        // expiresIn: Tiempo de expiración del token (ej: '24h', '7d')
        // Se obtiene de la variable de entorno JWT_EXPIRES_IN
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      
      // inject: Especifica las dependencias a inyectar en useFactory
      inject: [ConfigService],
    }),
  ],
  
  // controllers: Lista de controladores que pertenecen a este módulo
  controllers: [AuthController],
  
  // providers: Lista de servicios y estrategias que pueden ser inyectados
  // AuthService: Servicio principal de autenticación
  // LocalStrategy: Estrategia para validar email/password
  // JwtStrategy: Estrategia para validar tokens JWT
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

