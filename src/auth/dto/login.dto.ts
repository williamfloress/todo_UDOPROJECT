// Importa validadores de class-validator para validar los datos de entrada
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * LoginDto: Data Transfer Object para el endpoint de login
 * Define la estructura y validaciones de los datos que el cliente debe enviar
 * Usa decoradores de class-validator para validación automática
 */
export class LoginDto {
  /**
   * Email del usuario que intenta autenticarse
   * @IsEmail() - Valida que sea un formato de email válido
   * @IsNotEmpty() - Valida que el campo no esté vacío
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Contraseña del usuario en texto plano
   * @IsString() - Valida que sea una cadena de texto
   * @IsNotEmpty() - Valida que el campo no esté vacío
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
