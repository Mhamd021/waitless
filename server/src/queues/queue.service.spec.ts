import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { QueuesService } from "./queues.service";
import { Test, TestingModule } from "@nestjs/testing";
import { QueueRepository } from "./queue.repository";
import { CreateQueueDto } from "./dto/create-queue.dto";

describe('QueuesService', () => 
    {
        let service: QueuesService;
        const mockQueueRepository = {
            create: jest.fn().mockImplementation((adminId,dto:any) => {
                return {
                    adminId,
                    ...dto
                }
            })
        }

        beforeEach(async () => {
            jest.clearAllMocks();
            const module : TestingModule =  await Test.createTestingModule({
            providers:[QueuesService,
                {
                    provide: QueueRepository ,
                    useValue: mockQueueRepository
                }
            ]
            }).compile();

            service = module.get<QueuesService>(QueuesService);
        });

        it('should be defined', () => {
           expect(service).toBeDefined();
        });

        it('should create a queue',async () => {
            const dto = new CreateQueueDto();
            dto.name = 'Test Queue';
            
            const adminId = 'admin123';

            const result = await service.create(adminId, dto);
            expect(result).toEqual({
                adminId,
                ...dto
            });

        })
    });