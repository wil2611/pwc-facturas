import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsDateString,
  Matches,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateFacturaDto {
  @ApiPropertyOptional({ type: String, format: 'uuid' })
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsUUID()
  proveedor_id?: string;

  @ApiPropertyOptional({ type: String })
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  numero_factura?: string;

  @ApiPropertyOptional({ type: String, format: 'date', example: '2026-01-01' })
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_emision?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    nullable: true,
    example: '2026-01-31',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_vencimiento?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '38500.50',
    description: 'Valor positivo con máximo 16 enteros y 2 decimales.',
  })
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @Matches(/^(?=.*[1-9])\d{1,16}(?:\.\d{1,2})?$/, {
    message:
      'El valor debe ser positivo y tener máximo 16 enteros y 2 decimales.',
  })
  valor_total?: string;

  @ApiPropertyOptional({ example: 'COP', minLength: 3, maxLength: 3 })
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsString()
  @Length(3, 3)
  moneda?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  numero_contrato?: string | null;
}
