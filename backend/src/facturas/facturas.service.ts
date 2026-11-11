import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { UpdateFacturaDto } from './dto/update-factura.dto';
@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) { }

  create() {
    return this.prisma.factura.create
  }
  
  findAll(page: number, pageSize: number, proveedor?: string, fechaDesde?: Date | null, fechaHasta?: Date | null) {
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
    return this.prisma.factura.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { fecha_emision: 'desc' },
        { id: 'asc' },
      ],
      where: where,
    });
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
