// Importa decoradores y módulos de NestJS
import { Module } from '@nestjs/common';

// Importa TypeOrmModule para registrar la entidad Category
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa los componentes del módulo de categorías
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

// Importa la entidad Category para registrarla en TypeORM
import { Category } from './entities/category.entity';

/**
 * CategoriesModule: Módulo que centraliza toda la configuración de categorías
 * Registra la entidad, servicio y controlador para operaciones CRUD de categorías
 */
@Module({
  /**
   * TypeOrmModule.forFeature([Category])
   * Registra la entidad Category en TypeORM, permitiendo inyectar el repositorio
   * en el CategoriesService para realizar operaciones CRUD en la base de datos
   */
  imports: [TypeOrmModule.forFeature([Category])],
  
  /**
   * Controlador que maneja las rutas HTTP relacionadas con categorías
   * Define endpoints como POST /categories, GET /categories, etc.
   */
  controllers: [CategoriesController],
  
  /**
   * Servicio que contiene la lógica de negocio para categorías
   * Maneja operaciones como crear, buscar, actualizar y eliminar categorías
   */
  providers: [CategoriesService],
  
  /**
   * Exporta CategoriesService para que otros módulos puedan utilizarlo
   * Importante: Necesario para el módulo de tareas (TasksModule)
   * que requerirá validar que las categorías existan antes de crear tareas
   */
  exports: [CategoriesService], // Para usar en TasksModule
})
export class CategoriesModule {}
