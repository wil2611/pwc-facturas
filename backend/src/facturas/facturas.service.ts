import { BadGatewayException, ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFacturaDto } from './dto/create-factura.dto';
@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService, private configService: ConfigService) { }

  async create(archivo: Express.Multer.File) {
    const base64 = archivo.buffer.toString('base64');
    const mimeType = archivo.mimetype;
    const nombreArchivo = archivo.originalname;
    const tamaño = archivo.size;
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    const apiUrl = this.configService.getOrThrow<string>('GEMINI_API_URL');

    let response;
    try {
      response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            "parts": [
              {
                "text": `Extrae la información de esta factura y devuelve
                        unicamente un objeto JSON con los siguientes campos:

                        proveedor,
                        numero_factura,
                        fecha_emision,
                        fecha_vencimiento,
                        valor_total,
                        moneda,
                        numero_contrato.

                        Las fechas en formato YYYY-MM-DD.
                        El valor_total debe ser decimal.
                        La moneda debe ser tres letras, ejemplo COP.
                        Si un dato no aparece, devuelve null.
                        No inventes información.`
              }
            ]
          }, {
            "parts": [
              {
                "inlineData": {
                  "mimeType": mimeType,
                  "data": base64,
                }
              }
            ]
          }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          }
        }),
      });
    } catch (error) {
      console.error(error);
      throw new BadGatewayException("Error connecting to llm");
    }
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      throw new BadGatewayException("Error processing invoice with AI");
    }

    const resultado = await response.json();
    const textoGenerado = resultado.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textoGenerado) {
      throw new BadGatewayException("No response from llm");
    }
    let datosFactura;
    try {
      datosFactura = JSON.parse(textoGenerado);
    } catch (error) {
      throw new BadGatewayException("Invalid JSON from llm");
    }
    const factura = plainToInstance(CreateFacturaDto, datosFactura);
    const errors = await validate(factura);

    if (errors.length > 0) {
      console.error(errors);
      throw new UnprocessableEntityException("Invalid invoice data");
    }
    try {
      const transacion = await this.prisma.$transaction(async (transaction) => {
        let proveedor = await transaction.proveedor.findFirst({
          where: { nombre: factura.proveedor }
        })
        if (!proveedor) {
          proveedor = await transaction.proveedor.create({
            data: { nombre: factura.proveedor }
          });
        }
        let facturaCreada = await transaction.factura.create({
          data: {
            proveedor_id: proveedor.id,
            numero_factura: factura.numero_factura,
            fecha_emision: factura.fecha_emision,
            fecha_vencimiento: factura.fecha_vencimiento,
            valor_total: factura.valor_total,
            moneda: factura.moneda,
            numero_contrato: factura.numero_contrato
          }
        });
        await transaction.documento.create({
          data: {
            factura_id: facturaCreada.id,
            nombre_archivo: nombreArchivo,
            tipo_archivo: mimeType,
            size_bytes: tamaño,
            respuesta_llm: resultado
          }
        });
        return facturaCreada;
      });
      return transacion;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Factura already exists');
      }
      throw error;
    }
  }

  async findAll(page: number, pageSize: number, proveedor?: string, fechaDesde?: Date | null, fechaHasta?: Date | null) {
    const where: Prisma.FacturaWhereInput = {};
    if (proveedor) {
      where.proveedor = { nombre: { contains: proveedor, mode: 'insensitive' } };
    }
    if (fechaDesde || fechaHasta) {
      where.fecha_emision = {};
      if (fechaDesde) {
        where.fecha_emision.gte = fechaDesde;
      }
      if (fechaHasta) {
        where.fecha_emision.lte = fechaHasta;
      }
    }
    const totalCount = await this.prisma.factura.count({ where });
    const facturas = await this.prisma.factura.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { fecha_emision: 'desc' },
        { id: 'asc' },
      ],
      where: where,
      include: {
        proveedor: true,
      },
    });
    return { facturas, totalCount };
  }

  async findOne(id: string) {
    const factura = await this.prisma.factura.findUnique({
      where: { id },
      include: {
        proveedor: true,
        documento: true,
      },
    });

    if (!factura) {
      throw new NotFoundException('Factura not found');
    }

    return factura;
  }

  async Summary() {
    return this.prisma.$queryRaw`
      SELECT 
      proveedores.nombre AS proveedor,
      TO_CHAR(fecha_emision, 'YYYY-MM') AS mes_factura,
      moneda,
      COUNT(*):: int AS total_facturas, 
      SUM(valor_total) AS total_valor
      FROM facturas 
      Join proveedores ON facturas.proveedor_id = proveedores.id
      GrOUP BY 
      proveedores.id,
      proveedores.nombre, 
      TO_CHAR(fecha_emision, 'YYYY-MM'), 
      facturas.moneda
      Order By mes_factura DESC, total_valor DESC`;
  }

  async update(id: string, updateData: UpdateFacturaDto) {
    try {
      const updatedFactura = await this.prisma.factura.update({
        where: { id },
        data: updateData,
        include: {
          proveedor: true,
        },
      });
      return updatedFactura;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Factura not found');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Factura already exists');
        }
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedFactura = await this.prisma.factura.delete({
        where: { id },
      });
      return deletedFactura;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Factura not found');
        }
      }
      throw error;
    }
  }
}
