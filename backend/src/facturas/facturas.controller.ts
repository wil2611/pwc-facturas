import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, BadRequestException, Param, ParseUUIDPipe, Put, Body } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { UpdateFacturaDto } from './dto/update-factura.dto';
@Controller('facturas')
export class FacturasController {
    constructor(private facturasService: FacturasService) { }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.facturasService.findOne(id);
    }

    @Get()
    findAll(@Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
        @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe()) pageSize: number,
        @Query('proveedor') proveedor?: string,
        @Query('fechaDesde') fechaDesde?: string,
        @Query('fechaHasta') fechaHasta?: string) {

        if (page < 1 || pageSize < 1 || pageSize > 100) {
            throw new BadRequestException('invalid page or pageSize, Page must be greater than 0, and pageSize must be between 1 and 100.');
        }
        let fechaDesdeDate: Date | null = null;
        let fechaHastaDate: Date | null = null;

        if (fechaDesde) {
            fechaDesdeDate = new Date(fechaDesde);
            if (isNaN(fechaDesdeDate.getTime())) {
                throw new BadRequestException('Invalid date. Date format YYYY-MM-DD.');
            }
        }
        if (fechaHasta) {
            fechaHastaDate = new Date(fechaHasta);
            if (isNaN(fechaHastaDate.getTime())) {
                throw new BadRequestException('Invalid date. Date format YYYY-MM-DD.');
            }
        }
        if (fechaDesdeDate && fechaHastaDate && fechaDesdeDate > fechaHastaDate) {
            throw new BadRequestException('Start date must be before or equal to end date.');
        }

        return this.facturasService.findAll(page, pageSize, proveedor, fechaDesdeDate, fechaHastaDate);
    }

    @Put(':id')
    update(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateData: UpdateFacturaDto) {
        return this.facturasService.update(id, updateData);
    }
}
