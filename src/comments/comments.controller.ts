// Importa decoradores y tipos de NestJS para el controlador
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Importa el servicio de comentarios
import { CommentsService } from './comments.service';

// Importa el DTO para crear comentarios
import { CreateCommentDto } from './dto/create-comment.dto';

// Importa el guard JWT para proteger las rutas
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Decorador que marca esta clase como un controlador de NestJS
 * Define la ruta base para todos los endpoints: /tasks/:taskId/comments
 * Esta estructura RESTful indica que los comentarios son un recurso anidado dentro de las tareas
 */
@Controller('tasks/:taskId/comments')

/**
 * Decorador que protege todas las rutas de este controlador con autenticación JWT
 * Todas las peticiones deben incluir un token JWT válido en el header Authorization
 */
@UseGuards(JwtAuthGuard)

/**
 * CommentsController - Controlador que maneja las peticiones HTTP relacionadas con comentarios
 * Todas las rutas requieren autenticación JWT
 * Los comentarios están anidados dentro de las tareas (RESTful)
 */
export class CommentsController {
  /**
   * Constructor que recibe el servicio de comentarios mediante inyección de dependencias
   * @param commentsService - Servicio que contiene la lógica de negocio para los comentarios
   */
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Endpoint POST /tasks/:taskId/comments
   * Crea un nuevo comentario asociado a una tarea
   * El campo 'created_by' se extrae automáticamente del token JWT del usuario autenticado
   * 
   * @param taskId - ID de la tarea a la que pertenece el comentario (parámetro de la URL)
   * @param createCommentDto - DTO con el contenido del comentario a crear
   * @param req - Objeto Request de Express que contiene información del usuario autenticado
   * @returns Promise<Comment> - El comentario creado
   * @throws NotFoundException - Si la tarea no existe
   */
  @Post()
  @UsePipes(new ValidationPipe()) // Valida los datos del DTO antes de procesarlos
  create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    // Extraer userId del token JWT para el campo 'created_by' según ERD
    // req.user se establece automáticamente por JwtAuthGuard después de validar el token
    const userId = req.user.userId;
    
    // Llamar al servicio para crear el comentario
    return this.commentsService.create(taskId, createCommentDto, userId);
  }

  /**
   * Endpoint GET /tasks/:taskId/comments
   * Obtiene todos los comentarios de una tarea específica
   * Los comentarios se ordenan por fecha de creación ascendente (más antiguos primero)
   * 
   * @param taskId - ID de la tarea de la cual se quieren obtener los comentarios (parámetro de la URL)
   * @returns Promise<Comment[]> - Lista de comentarios de la tarea
   * @throws NotFoundException - Si la tarea no existe
   */
  @Get()
  findByTask(@Param('taskId') taskId: string) {
    // Llamar al servicio para obtener todos los comentarios de la tarea
    return this.commentsService.findByTask(taskId);
  }

  /**
   * Endpoint GET /tasks/:taskId/comments/:id
   * Obtiene un comentario específico por su ID
   * Incluye todas las relaciones (autor y tarea)
   * 
   * @param id - ID único del comentario (UUID) - parámetro de la URL
   * @returns Promise<Comment> - El comentario encontrado
   * @throws NotFoundException - Si el comentario no existe
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Llamar al servicio para obtener el comentario por ID
    return this.commentsService.findOne(id);
  }

  /**
   * Endpoint DELETE /tasks/:taskId/comments/:id
   * Elimina un comentario de la base de datos
   * 
   * @param id - ID único del comentario a eliminar (UUID) - parámetro de la URL
   * @returns Promise<void> - No retorna nada si la eliminación es exitosa
   * @throws NotFoundException - Si el comentario no existe
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Llamar al servicio para eliminar el comentario
    return this.commentsService.remove(id);
  }
}
