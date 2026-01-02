// Importa decoradores y clases de NestJS para crear endpoints
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Importa el servicio de categorías que contiene la lógica de negocio
import { CategoriesService } from './categories.service';

// Importa los DTOs para validar los datos de entrada
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Importa el guard JWT para proteger las rutas
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * CategoriesController: Controlador que maneja las rutas relacionadas con categorías
 * Expone endpoints para realizar operaciones CRUD sobre categorías
 * Todas las rutas están protegidas con JwtAuthGuard (requieren autenticación)
 */
@Controller('categories')
@UseGuards(JwtAuthGuard) // Proteger todas las rutas con autenticación JWT
export class CategoriesController {
  /**
   * Constructor que recibe el servicio de categorías mediante inyección de dependencias
   * @param categoriesService - Servicio que contiene los métodos de negocio
   */
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Endpoint POST /categories
   * Crea una nueva categoría
   * 
   * @UsePipes(new ValidationPipe()) - Valida automáticamente los datos del body usando el DTO
   * @Body() createCategoryDto - Datos de la categoría a crear (validados por CreateCategoryDto)
   * @returns Categoría creada
   */
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Endpoint GET /categories
   * Obtiene todas las categorías del sistema
   * 
   * @returns Array de todas las categorías
   */
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * Endpoint GET /categories/:id
   * Obtiene una categoría específica por su ID
   * 
   * @Param('id') id - UUID de la categoría a buscar
   * @returns Categoría encontrada
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Endpoint PATCH /categories/:id
   * Actualiza una categoría existente
   * 
   * @UsePipes(new ValidationPipe()) - Valida automáticamente los datos del body
   * @Param('id') id - UUID de la categoría a actualizar
   * @Body() updateCategoryDto - Datos a actualizar (todos opcionales, validados por UpdateCategoryDto)
   * @returns Categoría actualizada
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Endpoint DELETE /categories/:id
   * Elimina una categoría del sistema
   * 
   * @Param('id') id - UUID de la categoría a eliminar
   * @returns Sin contenido (status 204)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
