// Importa decoradores y excepciones de NestJS
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

// Importa decoradores y clases de TypeORM para trabajar con repositorios
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa la entidad Category
import { Category } from './entities/category.entity';

// Importa los DTOs para validación y tipado
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * CategoriesService: Servicio que maneja toda la lógica de negocio para categorías
 * Se encarga de las operaciones CRUD y validaciones de categorías
 */
@Injectable()
export class CategoriesService {
  /**
   * Constructor que inyecta el repositorio de TypeORM para la entidad Category
   * Permite realizar operaciones de base de datos de forma sencilla
   */
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Crea una nueva categoría en el sistema
   * Proceso:
   * 1. Verifica que el nombre no esté ya registrado (según validación del ERD)
   * 2. Si el color no se proporciona, usa el valor por defecto #000000
   * 3. Guarda la categoría en la base de datos
   * 
   * @param createCategoryDto - Datos de la categoría a crear (nombre, descripción, color)
   * @returns Categoría creada
   * @throws ConflictException si el nombre ya está registrado
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si el nombre ya existe en la base de datos
    // Esto previene duplicados y mantiene la integridad según el ERD (nombre único)
    const existing = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    // Si el nombre ya existe, lanzar excepción de conflicto
    if (existing) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    // Crear la categoría con los datos proporcionados
    // Si no se proporciona color, usar el valor por defecto #000000
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      color: createCategoryDto.color || '#000000',
    });

    // Guardar y retornar la categoría creada
    return await this.categoriesRepository.save(category);
  }

  /**
   * Obtiene todas las categorías del sistema
   * Retorna las categorías ordenadas por fecha de creación (más recientes primero)
   * 
   * @returns Array de todas las categorías
   */
  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca una categoría por su ID
   * 
   * @param id - UUID de la categoría a buscar
   * @returns Categoría encontrada con sus tareas relacionadas
   * @throws NotFoundException si la categoría no existe
   */
  async findOne(id: string): Promise<Category> {
    // Buscar la categoría incluyendo la relación con tareas
    // La relación tasks se descomentará cuando se cree la entidad Task
    const category = await this.categoriesRepository.findOne({
      where: { id },
      // relations: ['tasks'], // Se habilitará cuando se cree la entidad Task
    });

    // Si la categoría no existe, lanzar excepción
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  /**
   * Actualiza una categoría existente
   * Proceso:
   * 1. Verifica que la categoría exista
   * 2. Si se actualiza el nombre, verifica que no esté duplicado
   * 3. Aplica los cambios y guarda
   * 
   * @param id - UUID de la categoría a actualizar
   * @param updateCategoryDto - Datos a actualizar (todos opcionales)
   * @returns Categoría actualizada
   * @throws NotFoundException si la categoría no existe
   * @throws ConflictException si el nuevo nombre ya está en uso
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Obtener la categoría existente (lanza NotFoundException si no existe)
    const category = await this.findOne(id);

    // Si se actualiza el nombre, verificar que no esté duplicado
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      // Si el nuevo nombre ya existe, lanzar excepción de conflicto
      if (existing) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }

    // Aplicar los cambios proporcionados a la categoría existente
    Object.assign(category, updateCategoryDto);
    
    // Guardar y retornar la categoría actualizada
    return await this.categoriesRepository.save(category);
  }

  /**
   * Elimina una categoría del sistema
   * 
   * @param id - UUID de la categoría a eliminar
   * @throws NotFoundException si la categoría no existe
   */
  async remove(id: string): Promise<void> {
    // Obtener la categoría existente (lanza NotFoundException si no existe)
    const category = await this.findOne(id);
    
    // Eliminar la categoría de la base de datos
    await this.categoriesRepository.remove(category);
  }
}
