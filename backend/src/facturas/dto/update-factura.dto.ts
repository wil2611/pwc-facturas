import { IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, IsPositive, Length, IsDate } from "class-validator";
import{Type} from "class-transformer";
export class UpdateFacturaDto {
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
    @IsNumber({maxDecimalPlaces: 2})
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