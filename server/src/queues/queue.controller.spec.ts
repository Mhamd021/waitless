import { Test, TestingModule } from "@nestjs/testing";
import { expect,describe, beforeEach, it, jest } from "@jest/globals";
import { JwtService } from "@nestjs/jwt";
import { QueuesController } from "./queues.controller";
import { QueuesService } from "./queues.service";


describe('QueuesController',  () => 
    {
        let controller: QueuesController;
        const mockQueuesService = 
        {
            create: jest.fn().mockImplementation((adminId, dto:any) => {
                return {
                    name: dto.name,
                    description: dto.description,
                    adminId: adminId,
                };
            }   
            ),
            update: jest.fn().mockImplementation((id,adminId,dto:any) => {
                return {
                    id,
                    ...dto,
                    adminId,
                };
            }),
        };

        const mockJwtService = {verify: jest.fn()};
        const req = {
  user: {
    sub: 'admin-id-123',
  },
};
 const dto = {
            name: 'Test Queue',
            description: 'A queue for testing'
        };

        beforeEach( async () => {
            jest.clearAllMocks();

            const module : TestingModule = await Test.createTestingModule({
                
                controllers: [QueuesController],
                providers: [
                { provide: QueuesService, useValue: mockQueuesService },
                { provide: JwtService, useValue: mockJwtService },
]
            }).compile();   

            controller = module.get<QueuesController>(QueuesController);
        });
      
 it('should be defined', () => {
            expect(controller).toBeDefined();
        });

    it('should create a queue', async ()=> {
       

        const result = await controller.create(dto, req);

        expect(result).toEqual({
            name: 'Test Queue',
            description: 'A queue for testing',
            adminId: req.user.sub,
        });
        expect(mockQueuesService.create).toHaveBeenCalledWith(req.user.sub, dto);
    });

    it('should update a queue' , async () =>{
        const updatedto = {
            name: 'Updated Queue',
            description: 'An updated queue for testing',
            isOpen: true,
        };
        const result = await controller.update('queue-id-123',updatedto, req);
        expect(result).toEqual({
            id: 'queue-id-123',
            name: 'Updated Queue',
            description: 'An updated queue for testing',
            isOpen: true,
            adminId: req.user.sub,
        });
        expect(mockQueuesService.update).toHaveBeenCalledWith('queue-id-123', req.user.sub, updatedto);
    });
});
