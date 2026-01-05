/**
 * Enum TaskStatus - Define los estados posibles de una tarea
 * Según el ERD, una tarea puede estar en uno de estos estados:
 * - PENDING: Tarea pendiente (por defecto)
 * - IN_PROGRESS: Tarea en progreso
 * - DONE: Tarea completada
 */
export enum TaskStatus {
  /**
   * Estado PENDING - La tarea está pendiente de iniciar
   * Es el estado por defecto cuando se crea una nueva tarea
   */
  PENDING = 'PENDING',

  /**
   * Estado IN_PROGRESS - La tarea está en progreso
   * Indica que alguien está trabajando en la tarea
   */
  IN_PROGRESS = 'IN_PROGRESS',

  /**
   * Estado DONE - La tarea está completada
   * Indica que la tarea ha sido finalizada exitosamente
   */
  DONE = 'DONE',
}
