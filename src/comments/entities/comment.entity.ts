// Importa decoradores y tipos de TypeORM para definir la entidad
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Importa la entidad User para la relación ManyToOne (created_by)
import { User } from '../../users/entities/user.entity';

// Importa la entidad Task para la relación ManyToOne (which_todo)
import { Task } from '../../task/entities/task.entity';

/**
 * Entidad Comment - Representa un comentario (COMMENTARY) en la base de datos
 * Según el ERD, la entidad COMMENTARY tiene los siguientes campos:
 * - comment_id (PK) - Identificador único (UUID)
 * - created_by (FK) - Referencia a USER (usuario que crea el comentario) - Relación 1:N
 * - which_todo (FK) - Referencia a TO-DO (tarea a la que pertenece) - Relación 1:N
 * - comment_date - Fecha y hora de creación del comentario
 * - content - Contenido del comentario
 */
@Entity('comments')
export class Comment {
  /**
   * comment_id según ERD - ID único del comentario (UUID)
   * Se genera automáticamente por la base de datos
   * Es la clave primaria de la tabla
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * content según ERD - Contenido del comentario
   * Tipo: text en la base de datos
   * Campo obligatorio: todo comentario debe tener contenido
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * Relación ManyToOne con User (created_by) según ERD
   * Un usuario puede crear muchos comentarios (1:N)
   * created_by según ERD
   * Campo obligatorio: todo comentario debe tener un autor
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  author: User;

  /**
   * created_by - Clave foránea que referencia a la tabla users
   * Se mapea a la columna 'created_by' en la base de datos (snake_case)
   * Campo obligatorio
   */
  @Column({ name: 'created_by' })
  created_by: string;

  /**
   * Relación ManyToOne con Task (which_todo) según ERD
   * Una tarea puede tener muchos comentarios (1:N)
   * which_todo según ERD
   * Campo obligatorio: todo comentario debe pertenecer a una tarea
   */
  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'which_todo' })
  task: Task;

  /**
   * which_todo - Clave foránea que referencia a la tabla tasks
   * Se mapea a la columna 'which_todo' en la base de datos (snake_case)
   * Campo obligatorio
   */
  @Column({ name: 'which_todo' })
  which_todo: string;

  /**
   * comment_date según ERD - Fecha y hora de creación
   * Se establece automáticamente al crear el comentario
   * Usamos CreateDateColumn que se mapea a comment_date
   * Tipo: timestamp en la base de datos
   */
  @CreateDateColumn({ name: 'comment_date' })
  commentDate: Date;
}
