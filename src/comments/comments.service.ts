// Importa decoradores y excepciones de NestJS
import { Injectable, NotFoundException } from '@nestjs/common';

// Importa decoradores y tipos de TypeORM para trabajar con repositorios
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa la entidad Comment
import { Comment } from './entities/comment.entity';

// Importa el DTO para crear comentarios
import { CreateCommentDto } from './dto/create-comment.dto';

// Importa TaskService para validar que las tareas existen
import { TaskService } from '../task/task.service';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * CommentsService - Servicio que contiene la lógica de negocio para los comentarios
 * Maneja todas las operaciones CRUD (Create, Read, Delete) relacionadas con comentarios
 */
export class CommentsService {
  /**
   * Constructor que recibe el repositorio de Comment y TaskService mediante inyección de dependencias
   * @param commentsRepository - Repositorio de TypeORM para realizar operaciones en la base de datos de comentarios
   * @param tasksService - Servicio de tareas para validar que las tareas existan antes de crear comentarios
   */
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tasksService: TaskService,
  ) {}

  /**
   * Crea un nuevo comentario asociado a una tarea
   * El campo 'created_by' se extrae del token JWT del usuario autenticado
   * Valida que la tarea exista antes de crear el comentario
   * 
   * @param taskId - ID de la tarea a la que pertenece el comentario (UUID)
   * @param createCommentDto - DTO con los datos del comentario a crear (solo content)
   * @param userId - ID del usuario que crea el comentario (extraído del token JWT)
   * @returns Promise<Comment> - El comentario creado con todos sus datos
   * @throws NotFoundException - Si la tarea no existe
   */
  async create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    // Validar que la tarea existe antes de crear el comentario
    // Si la tarea no existe, findOne lanzará una NotFoundException
    await this.tasksService.findOne(taskId);

    // Crea una nueva instancia de Comment con los datos del DTO
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      // Asigna el ID de la tarea al campo 'which_todo' según ERD
      which_todo: taskId,
      // Asigna el ID del usuario autenticado al campo 'created_by' según ERD
      created_by: userId,
    });

    // Guarda el comentario en la base de datos y retorna el resultado
    return await this.commentsRepository.save(comment);
  }

  /**
   * Obtiene todos los comentarios de una tarea específica
   * Valida que la tarea exista antes de buscar comentarios
   * Los comentarios se ordenan por fecha de creación ascendente (más antiguos primero)
   * 
   * @param taskId - ID de la tarea de la cual se quieren obtener los comentarios (UUID)
   * @returns Promise<Comment[]> - Lista de comentarios de la tarea con información del autor
   * @throws NotFoundException - Si la tarea no existe
   */
  async findByTask(taskId: string): Promise<Comment[]> {
    // Validar que la tarea existe antes de buscar comentarios
    // Si la tarea no existe, findOne lanzará una NotFoundException
    await this.tasksService.findOne(taskId);

    // Busca todos los comentarios de la tarea con la información del autor
    return await this.commentsRepository.find({
      // Filtrar comentarios por el ID de la tarea (which_todo según ERD)
      where: { which_todo: taskId },
      // Cargar la relación con el autor (User) para incluir información del usuario
      relations: ['author'],
      // Ordenar por fecha de creación ascendente (más antiguos primero)
      // commentDate es el campo que se mapea a comment_date en la base de datos
      order: { commentDate: 'ASC' },
    });
  }

  /**
   * Obtiene un comentario específico por su ID
   * Incluye todas las relaciones (autor y tarea)
   * 
   * @param id - ID único del comentario (UUID)
   * @returns Promise<Comment> - El comentario encontrado con todas sus relaciones
   * @throws NotFoundException - Si el comentario no existe
   */
  async findOne(id: string): Promise<Comment> {
    // Busca el comentario por ID incluyendo las relaciones
    const comment = await this.commentsRepository.findOne({
      where: { id },
      // Cargar relaciones: autor (User) y tarea (Task)
      // author es la relación con User (created_by)
      relations: ['author', 'task'],
    });

    // Si el comentario no existe, lanzar una excepción
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Retornar el comentario encontrado
    return comment;
  }

  /**
   * Elimina un comentario de la base de datos
   * Primero verifica que el comentario exista
   * 
   * @param id - ID único del comentario a eliminar (UUID)
   * @returns Promise<void> - No retorna nada si la eliminación es exitosa
   * @throws NotFoundException - Si el comentario no existe
   */
  async remove(id: string): Promise<void> {
    // Buscar el comentario para verificar que existe
    const comment = await this.findOne(id);

    // Eliminar el comentario de la base de datos
    await this.commentsRepository.remove(comment);
  }
}
