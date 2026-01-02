import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Controlador de Usuarios
 * Maneja las peticiones HTTP relacionadas con la gestión de usuarios
 * Define los endpoints REST para operaciones CRUD de usuarios
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Endpoint para crear un nuevo usuario
   * Valida los datos recibidos con ValidationPipe antes de procesarlos
   * 
   * @param createUserDto - Datos del usuario a crear (nombre, email, password)
   * @returns Usuario creado (sin contraseña)
   */
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Endpoint para obtener todos los usuarios del sistema
   * No incluye contraseñas en los resultados por seguridad
   * 
   * @returns Array de usuarios
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Endpoint para obtener un usuario específico por su ID
   * El ID es un UUID (string), no un número
   * 
   * @param id - UUID del usuario a buscar
   * @returns Usuario encontrado (sin contraseña)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
