import { Test, TestingModule } from '@nestjs/testing';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { BadRequestException } from '@nestjs/common';

describe('FacturasController', () => {
  let controller: FacturasController;
  const facturasServiceMock = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [
        {
          provide: FacturasService,
          useValue: facturasServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FacturasController>(FacturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the requested invoice', async () => {
    const factura = {
      id: 'invoice-id',
      numero_factura: '12345',
    };
    facturasServiceMock.findOne.mockResolvedValue(factura);

    const result = await controller.findOne('invoice-id');
    expect(result).toEqual(factura);
    expect(facturasServiceMock.findOne).toHaveBeenCalledWith('invoice-id');
  });

  it('should reject page 0', () => {
    expect(() => controller.findAll(0, 10)).toThrow(BadRequestException);
  });

  it('should reject pageSize 0', () => {
    expect(() => controller.findAll(1, 0)).toThrow(BadRequestException);
  });
});
