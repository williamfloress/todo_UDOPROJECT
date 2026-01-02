// Importa PartialType de @nestjs/mapped-types para hacer todos los campos opcionales
import { PartialType } from '@nestjs/mapped-types';
// Importa el DTO de creación para reutilizar sus validaciones
import { CreateCategoryDto } from './create-category.dto';

/**
 * UpdateCategoryDto: Data Transfer Object para actualizar una categoría existente
 * Extiende CreateCategoryDto pero hace todos los campos opcionales
 * Esto permite actualizar solo los campos que se proporcionen
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
