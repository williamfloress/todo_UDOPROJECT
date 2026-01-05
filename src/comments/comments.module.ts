// Importa decoradores de NestJS
import { Module } from '@nestjs/common';

// Importa TypeOrmModule para registrar la entidad Comment
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa el servicio de comentarios
import { CommentsService } from './comments.service';

// Importa el controlador de comentarios
import { CommentsController } from './comments.controller';

// Importa la entidad Comment para registrarla en TypeORM
import { Comment } from './entities/comment.entity';

// Importa TaskModule para poder usar TaskService
import { TaskModule } from '../task/task.module';

/**
 * Decorador que marca esta clase como un módulo de NestJS
 * Los módulos organizan la aplicación en unidades funcionales
 */
@Module({
  /**
   * imports - Módulos y dependencias que este módulo necesita
   * TypeOrmModule.forFeature([Comment]): Registra la entidad Comment en TypeORM
   *   Permite inyectar el repositorio de Comment en el servicio
   * TaskModule: Importa el módulo de tareas para poder usar TaskService
   *   TaskService se usa para validar que las tareas existan antes de crear comentarios
   */
  imports: [
    TypeOrmModule.forFeature([Comment]), // Registra la entidad Comment para usar su repositorio
    TaskModule, // Importa el módulo de tareas para usar TaskService
  ],
  
  /**
   * controllers - Controladores que manejan las peticiones HTTP
   * CommentsController: Define los endpoints REST para los comentarios
   */
  controllers: [CommentsController],
  
  /**
   * providers - Servicios y otros proveedores inyectables
   * CommentsService: Contiene la lógica de negocio para los comentarios
   */
  providers: [CommentsService],
})
export class CommentsModule {}
