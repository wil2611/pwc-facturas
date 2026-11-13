import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresService } from './proveedores.service';
import { PrismaService } from '../prisma/prisma.service';
describe('ProveedoresService', () => {
  let service: ProveedoresService;
  const prismaMock = {
    proveedor: {
      findMany: jest.fn(),
    },
  };
  beforeEach(async () => {
    prismaMock.proveedor.findMany.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProveedoresService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProveedoresService>(ProveedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the providers', async () => {
    const proveedores = [
      { id: '1', nombre: 'Proveedor A' },
      { id: '2', nombre: 'Proveedor B' },
    ];
    prismaMock.proveedor.findMany.mockResolvedValue(proveedores);

    const result = await service.findAll();
    expect(result).toEqual(proveedores);
  });
});
