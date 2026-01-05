// Importa decoradores de NestJS
import { Module } from '@nestjs/common';

// Importa TypeOrmModule para registrar la entidad Task
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa el servicio de tareas
import { TaskService } from './task.service';

// Importa el controlador de tareas
import { TaskController } from './task.controller';

// Importa la entidad Task para registrarla en TypeORM
import { Task } from './entities/task.entity';

// Importa CategoriesModule para poder usar CategoriesService si es necesario
import { CategoriesModule } from '../categories/categories.module';

/**
 * Decorador que marca esta clase como un módulo de NestJS
 * Los módulos organizan la aplicación en unidades funcionales
 */
@Module({
  /**
   * imports - Módulos y dependencias que este módulo necesita
   * TypeOrmModule.forFeature([Task]): Registra la entidad Task en TypeORM
   *   Permite inyectar el repositorio de Task en el servicio
   * CategoriesModule: Importa el módulo de categorías para poder usar su servicio si es necesario
   */
  imports: [
    TypeOrmModule.forFeature([Task]), // Registra la entidad Task para usar su repositorio
    CategoriesModule, // Importa el módulo de categorías (por si se necesita en el futuro)
  ],
  
  /**
   * controllers - Controladores que manejan las peticiones HTTP
   * TaskController: Define los endpoints REST para las tareas
   */
  controllers: [TaskController],
  
  /**
   * providers - Servicios y otros proveedores inyectables
   * TaskService: Contiene la lógica de negocio para las tareas
   */
  providers: [TaskService],
})
export class TaskModule {}
