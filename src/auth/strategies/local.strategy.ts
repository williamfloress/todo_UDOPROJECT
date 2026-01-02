// Importa la estrategia Local de Passport para autenticación basada en username/password
import { Strategy } from 'passport-local';

// Importa PassportStrategy de NestJS para integrar Passport con NestJS
import { PassportStrategy } from '@nestjs/passport';

// Importa decoradores y excepciones de NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Importa el servicio de autenticación que contiene la lógica de validación de usuarios
import { AuthService } from '../auth.service';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 * Permite que esta estrategia sea inyectada en otros módulos
 */
@Injectable()

/**
 * LocalStrategy: Estrategia de autenticación usando email y password
 * Extiende PassportStrategy para integrarse con el sistema de autenticación de NestJS
 * Esta estrategia valida las credenciales del usuario antes de permitir el acceso
 */
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor que recibe el servicio de autenticación mediante inyección de dependencias
   * @param authService - Servicio que contiene los métodos para validar usuarios
   */
  constructor(private authService: AuthService) {
    // Llama al constructor de la clase padre (PassportStrategy) con la configuración
    // usernameField: 'email' - Configura Passport para usar 'email' en lugar del campo por defecto 'username'
    super({
      usernameField: 'email', // Cambiar de 'username' a 'email'
    });
  }

  /**
   * Método validate: Es llamado automáticamente por Passport cuando se intenta autenticar
   * Este método es parte del contrato de PassportStrategy y debe validar las credenciales
   * 
   * @param email - Email del usuario que intenta autenticarse
   * @param password - Contraseña en texto plano que debe ser validada
   * @returns Promise<any> - Retorna el objeto usuario si la validación es exitosa
   * @throws UnauthorizedException - Si las credenciales son inválidas
   */
  async validate(email: string, password: string): Promise<any> {
    // Llama al método validateUser del AuthService para verificar las credenciales
    // Este método comparará el password con el hash almacenado en la base de datos
    const user = await this.authService.validateUser(email, password);
    
    // Si el usuario no existe o las credenciales son incorrectas, user será null/undefined
    if (!user) {
      // Lanza una excepción de no autorizado con un mensaje descriptivo en español
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Si la validación fue exitosa, retorna el objeto usuario
    // Passport adjuntará este objeto a req.user para que esté disponible en los controladores
    return user;
  }
}
