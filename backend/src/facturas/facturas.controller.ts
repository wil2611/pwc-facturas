import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
  Param,
  ParseUUIDPipe,
  Put,
  Body,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { isDateString } from 'class-validator';
import { FacturasService } from './facturas.service';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private facturasService: FacturasService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Factura en PDF, JPG o PNG. Máximo 10 MB.',
    schema: {
      type: 'object',
      required: ['archivo'],
      properties: {
        archivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Factura registrada.' })
  @ApiResponse({ status: 400, description: 'No se recibió un archivo.' })
  @ApiResponse({ status: 409, description: 'La factura ya existe.' })
  @ApiResponse({ status: 413, description: 'El archivo supera los 10 MB.' })
  @ApiResponse({ status: 415, description: 'Formato de archivo no permitido.' })
  @ApiResponse({
    status: 422,
    description: 'Los datos extraídos no son válidos.',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 502,
    description: 'No se pudo procesar la respuesta de Gemini.',
  })
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (
          !['application/pdf', 'image/jpeg', 'image/png'].includes(
            file.mimetype,
          )
        ) {
          return callback(
            new UnsupportedMediaTypeException('PDF,JPG,PNG'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(@UploadedFile() archivo: Express.Multer.File) {
    if (!archivo) {
      throw new BadRequestException('File is required');
    }
    return this.facturasService.create(archivo);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'ID de la factura',
  })
  @ApiResponse({ status: 200, description: 'Factura encontrada.' })
  @ApiResponse({ status: 400, description: 'ID de factura inválido.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.facturasService.findOne(id);
  }

  @Get('reportes/resumen')
  @ApiResponse({
    status: 200,
    description: 'Totales agrupados por proveedor, mes y moneda.',
  })
  getSummary() {
    return this.facturasService.Summary();
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  })
  @ApiQuery({
    name: 'proveedor',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    schema: { type: 'string', format: 'date' },
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    schema: { type: 'string', format: 'date' },
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de facturas.' })
  @ApiResponse({ status: 400, description: 'Paginación o fechas inválidas.' })
  findAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
    @Query('proveedor') proveedor?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      throw new BadRequestException(
        'invalid page or pageSize, Page must be greater than 0, and pageSize must be between 1 and 100.',
      );
    }
    let fechaDesdeDate: Date | null = null;
    let fechaHastaDate: Date | null = null;

    if (fechaDesde) {
      fechaDesdeDate = new Date(fechaDesde);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fechaDesde) ||
        !isDateString(fechaDesde, { strict: true })
      ) {
        throw new BadRequestException('Invalid date. Date format YYYY-MM-DD.');
      }
    }
    if (fechaHasta) {
      fechaHastaDate = new Date(fechaHasta);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fechaHasta) ||
        !isDateString(fechaHasta, { strict: true })
      ) {
        throw new BadRequestException('Invalid date. Date format YYYY-MM-DD.');
      }
    }
    if (fechaDesdeDate && fechaHastaDate && fechaDesdeDate > fechaHastaDate) {
      throw new BadRequestException(
        'Start date must be before or equal to end date.',
      );
    }

    return this.facturasService.findAll(
      page,
      pageSize,
      proveedor,
      fechaDesdeDate,
      fechaHastaDate,
    );
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'ID de la factura',
  })
  @ApiResponse({ status: 200, description: 'Factura actualizada.' })
  @ApiResponse({ status: 400, description: 'ID o datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  @ApiResponse({ status: 409, description: 'La factura ya existe.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateData: UpdateFacturaDto,
  ) {
    return this.facturasService.update(id, updateData);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'ID de la factura',
  })
  @ApiResponse({ status: 200, description: 'Factura eliminada.' })
  @ApiResponse({ status: 400, description: 'ID de factura inválido.' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.facturasService.delete(id);
  }
}
