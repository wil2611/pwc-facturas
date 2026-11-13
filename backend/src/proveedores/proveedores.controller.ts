import { Controller, Get } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Proveedores')
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de proveedores.',
  })
  findAll() {
    return this.proveedoresService.findAll();
  }
}
