import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.factura.findMany();
  }
}
