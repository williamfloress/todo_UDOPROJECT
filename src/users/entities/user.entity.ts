import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid') // ID tipo UUID generado automaticamente
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true}) //Email único
    email: string;

    @Column('text', { select: false}) // select: false para seguridad( no devolvemos el password en las consultas)
    password: string;
    
}
