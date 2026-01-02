import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

/**
 * Módulo de Usuarios
 * Gestiona toda la funcionalidad relacionada con los usuarios del sistema
 */
@Module({
  /**
   * TypeOrmModule.forFeature([User])
   * Registra la entidad User en TypeORM, permitiendo inyectar el repositorio
   * en el UsersService para realizar operaciones CRUD en la base de datos
   */
  imports: [TypeOrmModule.forFeature([User])],
  
  /**
   * Controlador que maneja las rutas HTTP relacionadas con usuarios
   * Define endpoints como POST /users, GET /users, etc.
   */
  controllers: [UsersController],
  
  /**
   * Servicio que contiene la lógica de negocio para usuarios
   * Maneja operaciones como crear, buscar, actualizar usuarios
   */
  providers: [UsersService],
  
  /**
   * Exporta UsersService para que otros módulos puedan utilizarlo
   * Importante: Necesario para el módulo de autenticación (AuthModule)
   * que requiere validar usuarios y sus credenciales durante el login
   */
  exports: [UsersService],
})
export class UsersModule {}