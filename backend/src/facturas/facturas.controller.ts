import { Controller, Get } from '@nestjs/common';
import { FacturasService } from './facturas.service';
@Controller('facturas')
export class FacturasController {
    constructor(private facturasService: FacturasService) {}
    
    @Get()
    findAll() {
        return this.facturasService.findAll();
    }
}
