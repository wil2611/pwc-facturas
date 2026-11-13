import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Length,
  IsDateString,
  Matches,
  IsUUID,
  ValidateIf,
} from 'class-validator';
export class UpdateFacturaDto {
  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsUUID()
  proveedor_id?: string;

  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  numero_factura?: string;

  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_emision?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_vencimiento?: string | null;

  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor_total?: number;

  @ValidateIf((_obj: unknown, valor: unknown) => valor !== undefined)
  @IsString()
  @Length(3, 3)
  moneda?: string;

  @IsOptional()
  @IsString()
  numero_contrato?: string | null;
}
