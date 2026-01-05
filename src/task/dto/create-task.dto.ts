// Importa decoradores de validación de class-validator
import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, IsEnum, IsUUID } from 'class-validator';

// Importa el enum TaskStatus para validar el campo status
import { TaskStatus } from '../enums/task-status.enum';

/**
 * DTO (Data Transfer Object) para crear una nueva tarea
 * Define la estructura y validaciones de los datos que se reciben al crear una tarea
 * Todos los campos excepto 'name' son opcionales
 */
export class CreateTaskDto {
  /**
   * name - Nombre de la tarea
   * Campo obligatorio
   * Debe ser una cadena de texto no vacía
   */
  @IsNotEmpty({ message: 'El nombre de la tarea es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  /**
   * description - Descripción de la tarea
   * Campo opcional
   * Si se proporciona, debe ser una cadena de texto
   */
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  /**
   * storyPoints - Puntos de historia (complejidad)
   * Campo opcional
   * Debe ser un número entero si se proporciona
   * Representa la complejidad estimada de la tarea
   */
  @IsOptional()
  @IsInt({ message: 'Los puntos de historia deben ser un número entero' })
  storyPoints?: number;

  /**
   * dueDate - Fecha de vencimiento
   * Campo opcional
   * Debe ser una cadena en formato ISO 8601 (ej: "2024-12-31T00:00:00Z")
   * Se convertirá a objeto Date en el servicio
   */
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida en formato ISO' })
  dueDate?: string;

  /**
   * status - Estado de la tarea
   * Campo opcional
   * Si no se proporciona, se usará el valor por defecto (PENDING)
   * Debe ser uno de los valores del enum TaskStatus
   */
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado debe ser PENDING, IN_PROGRESS o DONE' })
  status?: TaskStatus;

  /**
   * category_id - ID de la categoría a la que pertenece la tarea
   * Campo opcional
   * Debe ser un UUID válido si se proporciona
   * Referencia a la tabla categories según ERD
   */
  @IsOptional()
  @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
  category_id?: string;

  /**
   * assigned_to - ID del usuario al que se asigna la tarea
   * Campo opcional
   * Debe ser un UUID válido si se proporciona
   * Referencia a la tabla users según ERD
   * Si no se proporciona, la tarea no estará asignada a nadie
   */
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido' })
  assigned_to?: string;
}
