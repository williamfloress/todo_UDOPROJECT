// Importa decoradores y tipos de NestJS para el controlador
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Importa el servicio de tareas
import { TaskService } from './task.service';

// Importa los DTOs para crear y obtener tareas
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

// Importa el guard JWT para proteger las rutas
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Decorador que marca esta clase como un controlador de NestJS
 * Define la ruta base para todos los endpoints: /tasks
 */
@Controller('tasks')

/**
 * Decorador que protege todas las rutas de este controlador con autenticación JWT
 * Todas las peticiones deben incluir un token JWT válido en el header Authorization
 */
@UseGuards(JwtAuthGuard)

/**
 * TaskController - Controlador que maneja las peticiones HTTP relacionadas con tareas
 * Todas las rutas requieren autenticación JWT
 */
export class TaskController {
  /**
   * Constructor que recibe el servicio de tareas mediante inyección de dependencias
   * @param tasksService - Servicio que contiene la lógica de negocio para las tareas
   */
  constructor(private readonly tasksService: TaskService) {}

  /**
   * Endpoint POST /tasks
   * Crea una nueva tarea
   * El campo 'created_by' se extrae automáticamente del token JWT del usuario autenticado
   * 
   * @param createTaskDto - DTO con los datos de la tarea a crear
   * @param req - Objeto Request de Express que contiene información del usuario autenticado
   * @returns Promise<Task> - La tarea creada
   */
  @Post()
  @UsePipes(new ValidationPipe()) // Valida los datos del DTO antes de procesarlos
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // Extraer userId del token JWT para el campo 'created_by' según ERD
    // req.user se establece automáticamente por JwtAuthGuard después de validar el token
    const userId = req.user.userId;
    
    // Llamar al servicio para crear la tarea
    return this.tasksService.create(createTaskDto, userId);
  }

  /**
   * Endpoint GET /tasks
   * Obtiene todas las tareas con filtros opcionales y paginación
   * Permite filtrar por status, categoría y usuario asignado
   * 
   * @param getTasksDto - DTO con los filtros y parámetros de paginación (query parameters)
   * @returns Promise<{ tasks: Task[]; total: number }> - Lista de tareas y total de resultados
   */
  @Get()
  findAll(@Query() getTasksDto: GetTasksDto) {
    // Llamar al servicio para obtener las tareas con los filtros aplicados
    return this.tasksService.findAll(getTasksDto);
  }

  /**
   * Endpoint GET /tasks/:id
   * Obtiene una tarea específica por su ID
   * Incluye todas las relaciones (categoría, creador, asignado)
   * 
   * @param id - ID único de la tarea (UUID)
   * @returns Promise<Task> - La tarea encontrada
   * @throws NotFoundException - Si la tarea no existe
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Llamar al servicio para obtener la tarea por ID
    return this.tasksService.findOne(id);
  }

  /**
   * Endpoint PATCH /tasks/:id
   * Actualiza una tarea existente
   * Solo actualiza los campos que se proporcionen en el body
   * 
   * @param id - ID único de la tarea a actualizar (UUID)
   * @param updateTaskDto - DTO con los campos a actualizar (parcial)
   * @returns Promise<Task> - La tarea actualizada
   * @throws NotFoundException - Si la tarea no existe
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe()) // Valida los datos del DTO antes de procesarlos
  update(@Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    // Llamar al servicio para actualizar la tarea
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * Endpoint DELETE /tasks/:id
   * Elimina una tarea de la base de datos
   * 
   * @param id - ID único de la tarea a eliminar (UUID)
   * @returns Promise<void> - No retorna nada si la eliminación es exitosa
   * @throws NotFoundException - Si la tarea no existe
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Llamar al servicio para eliminar la tarea
    return this.tasksService.remove(id);
  }
}
