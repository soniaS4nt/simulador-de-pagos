import { IsNotEmpty, IsString, IsNumber, Min, MaxLength, Matches, Length, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  fullName: string;

  @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  @Matches(/^\d+$/, { message: 'El número de tarjeta solo debe contener números' })
  @Transform(({ value }) => value.replace(/\s/g, '')) 
  cardNumber: string;

  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  @IsDateString({}, { message: 'Formato de fecha inválido' })
  expirationDate: string;

  @IsNotEmpty({ message: 'El CVV es requerido' })
  @IsString()
  @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
  @Matches(/^\d+$/, { message: 'El CVV solo debe contener números' })
  cvv: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(1000, { message: 'El monto mínimo es 1000 CLP' })
  amount: number;
}