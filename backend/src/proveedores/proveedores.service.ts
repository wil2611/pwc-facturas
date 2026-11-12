import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProveedoresService {
    constructor(private readonly prisma: PrismaService) {}
    async findAll() {
        return this.prisma.proveedor.findMany({
            select: {
                id: true,
                nombre: true,
            },
            orderBy: {
                nombre: 'asc',
            },
        });
    }
}
