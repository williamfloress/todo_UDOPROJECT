// Importa decoradores de validación de class-validator
import { IsOptional, IsEnum, IsUUID, IsInt, Min } from 'class-validator';

// Importa Type de class-transformer para convertir tipos en query parameters
import { Type } from 'class-transformer';

// Importa el enum TaskStatus para validar el filtro de estado
import { TaskStatus } from '../enums/task-status.enum';

/**
 * DTO (Data Transfer Object) para obtener y filtrar tareas
 * Define los parámetros de consulta (query parameters) para listar tareas
 * Todos los campos son opcionales, permitiendo filtros flexibles
 */
export class GetTasksDto {
  /**
   * status - Filtrar tareas por estado
   * Campo opcional
   * Si se proporciona, solo se devolverán tareas con ese estado
   * Debe ser uno de los valores del enum TaskStatus
   */
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado debe ser PENDING, IN_PROGRESS o DONE' })
  status?: TaskStatus;

  /**
   * category_id - Filtrar tareas por categoría
   * Campo opcional
   * Si se proporciona, solo se devolverán tareas de esa categoría
   * Debe ser un UUID válido
   */
  @IsOptional()
  @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
  category_id?: string;

  /**
   * assigned_to - Filtrar tareas por usuario asignado
   * Campo opcional
   * Si se proporciona, solo se devolverán tareas asignadas a ese usuario
   * Debe ser un UUID válido
   * Según ERD es 'assigned_to', no 'assigned_to_id'
   */
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido' })
  assigned_to?: string;

  /**
   * limit - Número máximo de tareas a devolver (paginación)
   * Campo opcional
   * Valor por defecto: 10
   * Debe ser un número entero mayor o igual a 1
   * Se usa para limitar el número de resultados en la consulta
   */
  @IsOptional()
  @Type(() => Number) // Convierte el string del query parameter a número
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  limit?: number = 10;

  /**
   * offset - Número de tareas a saltar (paginación)
   * Campo opcional
   * Valor por defecto: 0
   * Debe ser un número entero mayor o igual a 0
   * Se usa junto con limit para implementar paginación
   * Ejemplo: limit=10, offset=20 devuelve las tareas 21-30
   */
  @IsOptional()
  @Type(() => Number) // Convierte el string del query parameter a número
  @IsInt({ message: 'El offset debe ser un número entero' })
  @Min(0, { message: 'El offset debe ser mayor o igual a 0' })
  offset?: number = 0;
}
