import { IsEmail, IsString, MinLength} from 'class-validator';


export class CreateUserDto {
    @IsString()
    fullName: string;

    @IsEmail({}, { message: 'El email no es válido'})
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres'})
    password: string; 
}
