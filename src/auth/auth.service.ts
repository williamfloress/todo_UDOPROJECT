// Importa decoradores y excepciones de NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Importa JwtService para generar y firmar tokens JWT
import { JwtService } from '@nestjs/jwt';

// Importa el servicio de usuarios para acceder a los métodos de búsqueda
import { UsersService } from '../users/users.service';

// Importa bcrypt para comparar passwords hasheados
import * as bcrypt from 'bcrypt';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * AuthService: Servicio que maneja toda la lógica de autenticación
 * Se encarga de validar credenciales, generar tokens JWT y gestionar sesiones
 */
export class AuthService {
  /**
   * Constructor que recibe las dependencias necesarias mediante inyección
   * @param usersService - Servicio para buscar usuarios en la base de datos
   * @param jwtService - Servicio para generar y firmar tokens JWT
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * validateUser: Valida las credenciales de un usuario (email y password)
   * Compara el password proporcionado con el hash almacenado en la base de datos
   * 
   * @param email - Email del usuario que intenta autenticarse
   * @param password - Contraseña en texto plano a validar
   * @returns Promise<any> - Retorna el objeto usuario sin el password si es válido, null si no
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Busca el usuario en la base de datos por su email
    // findByEmail incluye el password hasheado que necesitamos para comparar
    const user = await this.usersService.findByEmail(email);
    
    // Verifica que el usuario existe Y que el password coincide con el hash almacenado
    // bcrypt.compare() compara el password en texto plano con el hash de forma segura
    if (user && (await bcrypt.compare(password, user.password))) {
      // Si las credenciales son válidas, elimina el password del objeto antes de retornarlo
      // Usa destructuring para separar password del resto de propiedades
      const { password, ...result } = user;
      
      // Retorna el objeto usuario sin el password por seguridad
      return result;
    }
    
    // Si el usuario no existe o el password no coincide, retorna null
    // Esto indica que la autenticación falló
    return null;
  }

  /**
   * login: Genera un token JWT para un usuario autenticado
   * Crea el payload del token con información del usuario y lo firma
   * 
   * @param user - Objeto usuario obtenido después de una validación exitosa
   * @returns Objeto con el access_token y datos del usuario
   */
  async login(user: any) {
    // Crea el payload del token JWT con información del usuario
    // sub (subject) es el estándar JWT para el ID del usuario
    const payload = { email: user.email, sub: user.id };
    
    // Retorna un objeto con el token JWT y la información del usuario
    return {
      // Genera y firma el token JWT usando el secret configurado en el módulo
      access_token: this.jwtService.sign(payload),
      // Incluye información del usuario (sin password) para el frontend
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
