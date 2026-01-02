import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) para crear un nuevo usuario
 * Define la estructura y validaciones de los datos que se reciben
 * al registrar un nuevo usuario en el sistema
 */
export class CreateUserDto {
  /**
   * Nombre completo del usuario
   * Validaciones:
   * - @IsNotEmpty(): El campo no puede estar vacío
   * - @IsString(): Debe ser un string
   * - @MinLength(3): Debe tener al menos 3 caracteres
   */
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  fullName: string;

  /**
   * Email del usuario (debe ser único en el sistema)
   * Validaciones:
   * - @IsNotEmpty(): El campo no puede estar vacío
   * - @IsEmail(): Debe tener formato de email válido (ej: usuario@dominio.com)
   */
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  /**
   * Contraseña del usuario (se hasheará antes de guardar)
   * Validaciones:
   * - @IsNotEmpty(): El campo no puede estar vacío
   * - @IsString(): Debe ser un string
   * - @MinLength(6): Debe tener al menos 6 caracteres por seguridad
   */
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
