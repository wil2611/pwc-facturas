import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacturasService } from './facturas.service';
import { Prisma } from '../generated/prisma/client';

describe('FacturasService', () => {
  let service: FacturasService;
  const prismaMock = {
    factura: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    prismaMock.factura.findUnique.mockReset();
    prismaMock.factura.update.mockReset();
    prismaMock.factura.delete.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturasService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<FacturasService>(FacturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw when the invoice does not exist', async () => {
    prismaMock.factura.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invoice-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should return an existing invoice', async () => {
    const mockInvoice = {
      id: 'invoice-id',
      proveedor: { id: 'provider-id', nombre: 'Provider Name' },
      documento: { id: 'document-id', nombre: 'Document Name' },
    };
    prismaMock.factura.findUnique.mockResolvedValue(mockInvoice);

    const result = await service.findOne('invoice-id');
    expect(result).toEqual(mockInvoice);
  });

  it('should return the updated invoice', async () => {
    const facturaActualizada = {
      id: 'invoice-id',
      numero_factura: '12345',
    };
    prismaMock.factura.update.mockResolvedValue(facturaActualizada);

    const result = await service.update('invoice-id', {
      numero_factura: '12345',
    });
    expect(result).toEqual(facturaActualizada);
  });

  it('should throw when updating an invoice that does not exist', async () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Failed to update invoice because it does not exist',
      {
        code: 'P2025',
        clientVersion: 'test',
      },
    );

    prismaMock.factura.update.mockRejectedValue(error);

    await expect(
      service.update('non-existent-invoice-id', { numero_factura: '12345' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete the requested invoice', async () => {
    const facturaEliminada = {
      id: 'invoice-id',
      numero_factura: '12345',
    };
    prismaMock.factura.delete.mockResolvedValue(facturaEliminada);

    await service.delete('invoice-id');

    expect(prismaMock.factura.delete).toHaveBeenCalledWith({
      where: { id: 'invoice-id' },
    });
  });

  it('should throw when deleting an invoice that does not exist', async () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Failed to delete invoice because it does not exist',
      {
        code: 'P2025',
        clientVersion: 'test',
      },
    );
    prismaMock.factura.delete.mockRejectedValue(error);
    await expect(service.delete('non-existent-invoice-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
