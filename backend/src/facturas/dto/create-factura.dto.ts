import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, Length, IsDate } from "class-validator";
import{Type} from "class-transformer";
export class CreateFacturaDto {

    @IsString()
    @IsNotEmpty()
    proveedor!: string;

    @IsString()
    @IsNotEmpty()
    numero_factura!: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fecha_emision!: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_vencimiento?: Date | null;

    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
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