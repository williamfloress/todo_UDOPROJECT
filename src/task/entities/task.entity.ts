// Importa decoradores y tipos de TypeORM para definir la entidad
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

// Importa la entidad Category para la relación ManyToOne
import { Category } from '../../categories/entities/category.entity';

// Importa la entidad User para las relaciones ManyToOne (created_by y assigned_to)
import { User } from '../../users/entities/user.entity';

// Importa el enum TaskStatus para el campo status
import { TaskStatus } from '../enums/task-status.enum';

// Importa la entidad Comment para la relación OneToMany
import { Comment } from '../../comments/entities/comment.entity';

/**
 * Entidad Task - Representa una tarea (TO-DO) en la base de datos
 * Según el ERD, la entidad TO-DO tiene los siguientes campos:
 * - todo_id (PK) - Identificador único (UUID)
 * - name - Nombre de la tarea
 * - description - Descripción de la tarea
 * - status - Estado (ENUM: PENDING, IN_PROGRESS, DONE)
 * - story_points - Puntos de historia (complejidad)
 * - due_date - Fecha de vencimiento
 * - created_by (FK) - Referencia a USER (usuario que crea la tarea) - Relación 1:N
 * - assigned_to (FK) - Referencia a USER (usuario asignado) - Relación 1:N (opcional)
 * - category_id (FK) - Referencia a CATEGORY - Relación N:1
 */
@Entity('tasks')
export class Task {
  /**
   * todo_id según ERD - ID único de la tarea (UUID)
   * Se genera automáticamente por la base de datos
   * Es la clave primaria de la tabla
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * name según ERD - Nombre de la tarea
   * Tipo: varchar(255) en la base de datos
   * Campo obligatorio
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * description según ERD - Descripción de la tarea
   * Tipo: text en la base de datos
   * Campo opcional (puede ser null)
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * story_points según ERD - Puntos de historia (complejidad)
   * Tipo: int en la base de datos
   * Valor por defecto: 0
   * Se mapea a la columna 'story_points' en la base de datos (snake_case)
   */
  @Column({ type: 'int', default: 0, name: 'story_points' })
  storyPoints: number;

  /**
   * due_date según ERD - Fecha de vencimiento
   * Tipo: timestamp en la base de datos
   * Campo opcional (puede ser null)
   * Se mapea a la columna 'due_date' en la base de datos (snake_case)
   */
  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate: Date;

  /**
   * status según ERD - Estado de la tarea (ENUM)
   * Valores posibles: PENDING, IN_PROGRESS, DONE
   * Valor por defecto: PENDING
   * Se almacena como enum en PostgreSQL
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  /**
   * Relación ManyToOne con Category según ERD
   * Una tarea pertenece a una categoría (N:1)
   * category_id según ERD
   * Es opcional: una tarea puede no tener categoría asignada
   */
  @ManyToOne(() => Category, (category) => category.tasks, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  /**
   * category_id - Clave foránea que referencia a la tabla categories
   * Se mapea a la columna 'category_id' en la base de datos (snake_case)
   * Campo opcional (puede ser null)
   */
  @Column({ nullable: true, name: 'category_id' })
  category_id: string;

  /**
   * Relación ManyToOne con User (creada_por) según ERD
   * Un usuario puede crear muchas tareas (1:N)
   * created_by según ERD
   * Campo obligatorio: toda tarea debe tener un creador
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  /**
   * created_by - Clave foránea que referencia a la tabla users
   * Se mapea a la columna 'created_by' en la base de datos (snake_case)
   * Campo obligatorio
   */
  @Column({ name: 'created_by' })
  created_by: string;

  /**
   * Relación ManyToOne con User (asignada_a) según ERD
   * Un usuario puede tener asignadas muchas tareas (1:N)
   * assigned_to según ERD (opcional)
   * Es opcional: una tarea puede no estar asignada a nadie
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  /**
   * assigned_to - Clave foránea que referencia a la tabla users
   * Se mapea a la columna 'assigned_to' en la base de datos (snake_case)
   * Campo opcional (puede ser null)
   */
  @Column({ nullable: true, name: 'assigned_to' })
  assigned_to: string;

  /**
   * Fecha de creación del registro
   * Se establece automáticamente al crear la tarea
   * Campos de auditoría adicionales al ERD pero útiles para tracking
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   * Se actualiza automáticamente cada vez que se modifica la tarea
   * Campos de auditoría adicionales al ERD pero útiles para tracking
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relación OneToMany con Comment según ERD
   * Una tarea puede tener muchos comentarios (1:N)
   * Esta relación permite acceder a todos los comentarios de una tarea
   * El segundo parámetro (comment) => comment.task especifica el lado inverso de la relación
   */
  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
