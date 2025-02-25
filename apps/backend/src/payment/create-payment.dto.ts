import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, MaxLength, Matches, Length, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  fullName: string;
  
  @ApiProperty({ example: '4111111111111111' })
  @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  @Matches(/^\d+$/, { message: 'El número de tarjeta solo debe contener números' })
  @Transform(({ value }) => value.replace(/\s/g, ''))
  cardNumber: string;

  @ApiProperty({ example: '12/25', description: 'Formato MM/YY' })
  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: 'Formato de fecha inválido, debe ser MM/YY' })
  expirationDate: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty({ message: 'El CVV es requerido' })
  @IsString()
  @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
  @Matches(/^\d+$/, { message: 'El CVV solo debe contener números' })
  cvv: string;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(1000, { message: 'El monto insuficiente' })
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  amount: number;
}