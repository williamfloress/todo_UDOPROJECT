// Importa decoradores y clases de NestJS para crear endpoints
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';

// Importa el servicio de autenticación que contiene la lógica de negocio
import { AuthService } from './auth.service';

// Importa el guard Local para proteger el endpoint de login
import { LocalAuthGuard } from './guards/local-auth.guard';

// Importa el DTO para validar los datos de entrada del login
import { LoginDto } from './dto/login.dto';

/**
 * AuthController: Controlador que maneja las rutas relacionadas con autenticación
 * Expone endpoints para login y otros procesos de autenticación
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructor que recibe el servicio de autenticación mediante inyección de dependencias
   * @param authService - Servicio que contiene los métodos de autenticación
   */
  constructor(private authService: AuthService) {}

  /**
   * Endpoint POST /auth/login
   * Permite a los usuarios autenticarse con email y password
   * 
   * @UseGuards(LocalAuthGuard) - Aplica el guard Local que valida las credenciales
   *                               usando la LocalStrategy antes de ejecutar este método
   * @Request() req - Objeto de petición que contiene req.user (establecido por LocalStrategy)
   * @Body() loginDto - Datos del login (email y password) validados por el DTO
   * @returns Token JWT y datos del usuario autenticado
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // req.user contiene el objeto usuario devuelto por LocalStrategy después de validar
    // Se pasa al método login del servicio para generar el token JWT
    return this.authService.login(req.user);
  }
}
