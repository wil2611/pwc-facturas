import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresController } from './proveedores.controller';
import { ProveedoresService } from './proveedores.service';
describe('ProveedoresController', () => {
  let controller: ProveedoresController;
  const proveedoresServiceMock = {
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    proveedoresServiceMock.findAll.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedoresController],
      providers: [
        {
          provide: ProveedoresService,
          useValue: proveedoresServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProveedoresController>(ProveedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the providers', async () => {
    const proveedores = [
      { id: '1', nombre: 'Proveedor A' },
      { id: '2', nombre: 'Proveedor B' },
    ];
    proveedoresServiceMock.findAll.mockResolvedValue(proveedores);

    const result = await controller.findAll();
    expect(result).toEqual(proveedores);
    expect(proveedoresServiceMock.findAll).toHaveBeenCalled();
  });
});
