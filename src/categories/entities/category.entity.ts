import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// Importa la entidad Task para la relación OneToMany
import { Task } from '../../task/entities/task.entity';

/**
 * Entidad Category - Representa una categoría en la base de datos
 * Según el ERD, la entidad CATEGORY tiene los siguientes campos:
 * - category_id (PK) - Identificador único (UUID)
 * - name - Nombre de la categoría
 * - description - Descripción de la categoría
 * - color - Color en formato HEX
 * 
 * Relación: Una CATEGORY tiene muchas TO-DO (1:N)
 */
@Entity('categories')
export class Category {
  /**
   * category_id según ERD - ID único de la categoría (UUID)
   * Se genera automáticamente por la base de datos
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * name según ERD - Nombre de la categoría (debe ser único)
   * Se valida que no existan nombres duplicados en el servicio
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  /**
   * description según ERD - Descripción de la categoría
   * Es opcional y puede ser null
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * color según ERD - Color en formato HEX (ej: #FF5733)
   * Valor por defecto: #000000 (negro)
   * Se valida el formato HEX en el DTO
   */
  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color: string;

  /**
   * Relación OneToMany con Task según ERD
   * Una categoría puede tener muchas tareas (1:N)
   * Esta relación permite acceder a todas las tareas de una categoría
   * El segundo parámetro (task) => task.category especifica el lado inverso de la relación
   */
  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];

  /**
   * Fecha de creación del registro
   * Se establece automáticamente al crear la categoría
   * Campos de auditoría adicionales al ERD pero útiles para tracking
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   * Se actualiza automáticamente cada vez que se modifica la categoría
   * Campos de auditoría adicionales al ERD pero útiles para tracking
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
