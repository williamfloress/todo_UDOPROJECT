// Importa decoradores de validación de class-validator
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) para crear un nuevo comentario
 * Define la estructura y validaciones de los datos que se reciben al crear un comentario
 * Solo requiere el campo 'content' ya que 'created_by' se extrae del token JWT
 * y 'which_todo' se obtiene del parámetro de la URL
 */
export class CreateCommentDto {
  /**
   * content - Contenido del comentario
   * Campo obligatorio
   * Debe ser una cadena de texto no vacía
   * Longitud mínima: 1 carácter (para evitar comentarios vacíos)
   */
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @MinLength(1, { message: 'El contenido del comentario no puede estar vacío' })
  content: string;
}
