import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Length,
  IsDateString,
  Matches,
} from 'class-validator';
export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  proveedor!: string;

  @IsString()
  @IsNotEmpty()
  numero_factura!: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_emision!: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fecha_vencimiento?: string | null;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor_total!: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  moneda!: string;

  @IsOptional()
  @IsString()
  numero_contrato?: string | null;
}
