import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad User - Representa un usuario en la base de datos
 * Define la estructura de la tabla 'users' en PostgreSQL
 */
@Entity('users')
export class User {
  /**
   * ID único del usuario (UUID)
   * Se genera automáticamente por la base de datos
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre completo del usuario
   * Tipo: varchar(255) en la base de datos
   */
  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  /**
   * Email del usuario (debe ser único)
   * Se valida que no existan emails duplicados
   * Tipo: varchar(255) con restricción UNIQUE
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Contraseña hasheada del usuario
   * select: false - No se devuelve en consultas por defecto (seguridad)
   * Solo se incluye explícitamente cuando se necesita (ej: validación de login)
   * Tipo: varchar(255)
   */
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  /**
   * Fecha de creación del registro
   * Se establece automáticamente al crear el usuario
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   * Se actualiza automáticamente cada vez que se modifica el usuario
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
