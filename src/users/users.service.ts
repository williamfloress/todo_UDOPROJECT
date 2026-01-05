import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Servicio de Usuarios
 * Contiene toda la lógica de negocio para gestionar usuarios
 * Se encarga de las operaciones CRUD y validaciones de usuarios
 */
@Injectable()
export class UsersService {
  /**
   * Constructor que inyecta el repositorio de TypeORM para la entidad User
   * Permite realizar operaciones de base de datos de forma sencilla
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en el sistema
   * Proceso:
   * 1. Verifica que el email no esté ya registrado
   * 2. Hashea la contraseña usando bcrypt antes de guardarla
   * 3. Guarda el usuario en la base de datos
   * 
   * @param createUserDto - Datos del usuario a crear (nombre, email, password)
   * @returns Usuario creado (sin incluir la contraseña)
   * @throws ConflictException si el email ya está registrado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe en la base de datos
    // Esto previene duplicados y mantiene la integridad de los datos
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // Si el email ya existe, lanzar excepción de conflicto
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña antes de guardarla
    // bcrypt.genSalt(10): Genera un salt con factor de coste 10 (balance entre seguridad y performance)
    // bcrypt.hash(): Aplica el algoritmo de hashing a la contraseña con el salt
    // Esto asegura que las contraseñas nunca se almacenen en texto plano
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Crear una nueva instancia de usuario con los datos recibidos
    // Reemplazar la contraseña en texto plano con la versión hasheada
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos y retornarlo
    return await this.usersRepository.save(user);
  }

  /**
   * Obtiene todos los usuarios del sistema
   * No incluye la contraseña en los resultados por seguridad
   * 
   * @returns Array de usuarios (sin contraseñas)
   */
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      // Especificar explícitamente los campos a retornar, excluyendo password
      // Esto garantiza que nunca se exponga información sensible
      select: ['id', 'email', 'fullName', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Busca un usuario por su ID
   * 
   * @param id - UUID del usuario a buscar
   * @returns Usuario encontrado (sin contraseña)
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      // Excluir password del resultado por seguridad
      select: ['id', 'email', 'fullName', 'createdAt', 'updatedAt'],
    });

    // Si el usuario no existe, lanzar una excepción
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Busca un usuario por su email
   * IMPORTANTE: Este método SÍ incluye el password porque se usa para validación de login
   * Solo debe usarse en contextos seguros (ej: módulo de autenticación)
   * 
   * @param email - Email del usuario a buscar
   * @returns Usuario encontrado (incluyendo password hasheado) o null si no existe
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      // Incluir password porque se necesita para comparar con bcrypt en el login
      select: ['id', 'email', 'password', 'fullName', 'createdAt'],
    });
  }
}
