// Importa validadores de class-validator para validar los datos de entrada
import { IsString, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

/**
 * CreateCategoryDto: Data Transfer Object para crear una nueva categoría
 * Define la estructura y validaciones de los datos que el cliente debe enviar
 * Usa decoradores de class-validator para validación automática
 */
export class CreateCategoryDto {
  /**
   * name según ERD - Nombre de la categoría
   * @IsNotEmpty() - Valida que el campo no esté vacío
   * @IsString() - Valida que sea una cadena de texto
   * @MinLength(2) - Valida que tenga al menos 2 caracteres
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  /**
   * description según ERD - Descripción de la categoría (opcional)
   * @IsOptional() - Permite que el campo sea opcional
   * @IsString() - Valida que sea una cadena de texto si se proporciona
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * color según ERD - Color en formato HEX (opcional)
   * @IsOptional() - Permite que el campo sea opcional
   * @IsString() - Valida que sea una cadena de texto si se proporciona
   * @Matches() - Valida que sea un código HEX válido (ej: #FF5733 o #FFF)
   * Si no se proporciona, se usará el valor por defecto #000000
   */
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'El color debe ser un código HEX válido (ej: #FF5733)',
  })
  color?: string;
}
