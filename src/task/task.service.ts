// Importa decoradores y excepciones de NestJS
import { Injectable, NotFoundException } from '@nestjs/common';

// Importa decoradores y tipos de TypeORM para trabajar con repositorios
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa la entidad Task
import { Task } from './entities/task.entity';

// Importa los DTOs para crear y obtener tareas
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

// Importa el enum TaskStatus para el tipo de status
import { TaskStatus } from './enums/task-status.enum';

/**
 * Decorador que marca esta clase como un proveedor inyectable de NestJS
 */
@Injectable()

/**
 * TaskService - Servicio que contiene la lógica de negocio para las tareas
 * Maneja todas las operaciones CRUD (Create, Read, Update, Delete) y filtros
 */
export class TaskService {
  /**
   * Constructor que recibe el repositorio de Task mediante inyección de dependencias
   * @param tasksRepository - Repositorio de TypeORM para realizar operaciones en la base de datos
   */
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  /**
   * Crea una nueva tarea en la base de datos
   * El campo 'created_by' se extrae del token JWT del usuario autenticado
   * 
   * @param createTaskDto - DTO con los datos de la tarea a crear
   * @param userId - ID del usuario que crea la tarea (extraído del token JWT)
   * @returns Promise<Task> - La tarea creada con todos sus datos
   */
  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    // Crea una nueva instancia de Task con los datos del DTO
    const task = this.tasksRepository.create({
      ...createTaskDto,
      // Asigna el ID del usuario autenticado al campo 'created_by' según ERD
      created_by: userId,
      // Convierte la fecha de vencimiento de string a Date si se proporciona
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
    });

    // Guarda la tarea en la base de datos y retorna el resultado
    return await this.tasksRepository.save(task);
  }

  /**
   * Obtiene todas las tareas con filtros opcionales y paginación
   * Permite filtrar por status, categoría y usuario asignado
   * 
   * @param getTasksDto - DTO con los filtros y parámetros de paginación
   * @returns Promise<{ tasks: Task[]; total: number }> - Lista de tareas y total de resultados
   */
  async findAll(getTasksDto: GetTasksDto): Promise<{ tasks: Task[]; total: number }> {
    // Crea un query builder para construir la consulta SQL de forma dinámica
    const queryBuilder = this.tasksRepository.createQueryBuilder('task');

    // Aplicar filtro por status si se proporciona
    if (getTasksDto.status) {
      // Agrega una condición WHERE para filtrar por estado
      queryBuilder.andWhere('task.status = :status', { status: getTasksDto.status });
    }

    // Aplicar filtro por categoría si se proporciona
    if (getTasksDto.category_id) {
      // Agrega una condición WHERE para filtrar por categoría
      queryBuilder.andWhere('task.category_id = :category_id', {
        category_id: getTasksDto.category_id,
      });
    }

    // Aplicar filtro por usuario asignado si se proporciona
    if (getTasksDto.assigned_to) {
      // Agrega una condición WHERE para filtrar por usuario asignado
      queryBuilder.andWhere('task.assigned_to = :assigned_to', {
        assigned_to: getTasksDto.assigned_to,
      });
    }

    // Contar el total de resultados que coinciden con los filtros (antes de paginación)
    // Esto es necesario para la paginación y mostrar el total de resultados
    const total = await queryBuilder.getCount();

    // Aplicar paginación: limit y offset
    const limit = getTasksDto.limit || 10; // Número de resultados por página
    const offset = getTasksDto.offset || 0; // Número de resultados a saltar
    queryBuilder.skip(offset).take(limit);

    // Cargar relaciones (joins) para obtener datos relacionados
    // leftJoinAndSelect carga las relaciones de forma opcional (si existen)
    queryBuilder
      .leftJoinAndSelect('task.category', 'category') // Carga la categoría de la tarea
      .leftJoinAndSelect('task.createdBy', 'createdBy') // Carga el usuario que creó la tarea
      .leftJoinAndSelect('task.assignedTo', 'assignedTo'); // Carga el usuario asignado a la tarea

    // Ordenar por fecha de creación descendente (más recientes primero)
    queryBuilder.orderBy('task.createdAt', 'DESC');

    // Ejecutar la consulta y obtener los resultados
    const tasks = await queryBuilder.getMany();

    // Retornar las tareas y el total de resultados
    return { tasks, total };
  }

  /**
   * Obtiene una tarea específica por su ID
   * Incluye todas las relaciones (categoría, creador, asignado)
   * 
   * @param id - ID único de la tarea (UUID)
   * @returns Promise<Task> - La tarea encontrada con todas sus relaciones
   * @throws NotFoundException - Si la tarea no existe
   */
  async findOne(id: string): Promise<Task> {
    // Busca la tarea por ID incluyendo las relaciones
    const task = await this.tasksRepository.findOne({
      where: { id },
      // Cargar relaciones: categoría, usuario creador y usuario asignado
      relations: ['category', 'createdBy', 'assignedTo'],
    });

    // Si la tarea no existe, lanzar una excepción
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    // Retornar la tarea encontrada
    return task;
  }

  /**
   * Actualiza una tarea existente
   * Solo actualiza los campos que se proporcionen en el DTO
   * 
   * @param id - ID único de la tarea a actualizar (UUID)
   * @param updateTaskDto - DTO con los campos a actualizar (parcial)
   * @returns Promise<Task> - La tarea actualizada
   * @throws NotFoundException - Si la tarea no existe
   */
  async update(id: string, updateTaskDto: Partial<CreateTaskDto>): Promise<Task> {
    // Buscar la tarea para verificar que existe
    const task = await this.findOne(id);

    // Si se proporciona una fecha de vencimiento, convertirla de string a Date
    if (updateTaskDto.dueDate) {
      updateTaskDto.dueDate = new Date(updateTaskDto.dueDate) as any;
    }

    // Actualizar los campos de la tarea con los valores del DTO
    // Object.assign copia las propiedades del DTO a la entidad Task
    Object.assign(task, updateTaskDto);

    // Guardar los cambios en la base de datos y retornar la tarea actualizada
    return await this.tasksRepository.save(task);
  }

  /**
   * Elimina una tarea de la base de datos
   * Primero verifica que la tarea exista
   * 
   * @param id - ID único de la tarea a eliminar (UUID)
   * @returns Promise<void> - No retorna nada si la eliminación es exitosa
   * @throws NotFoundException - Si la tarea no existe
   */
  async remove(id: string): Promise<void> {
    // Buscar la tarea para verificar que existe
    const task = await this.findOne(id);

    // Eliminar la tarea de la base de datos
    await this.tasksRepository.remove(task);
  }
}
