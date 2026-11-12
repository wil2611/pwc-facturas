import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Length,
  IsDate,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateFacturaDto {
  @IsOptional()
  @IsUUID()
  proveedor_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numero_factura?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_emision?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_vencimiento?: Date | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor_total?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  moneda?: string;

  @IsOptional()
  @IsString()
  numero_contrato?: string | null;
}
