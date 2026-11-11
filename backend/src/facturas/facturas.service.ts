import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) { }
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
}
