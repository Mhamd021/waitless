import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { EntriesController } from "./entries.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EntriesService } from "./entries.service";
import { JwtService } from "@nestjs/jwt";
import { EntryRepository } from "./entries.repository";
import { QueueRepository } from "../queues/queue.repository";
import { QueueGateway } from "../gateway/queue.gateway";
import { getQueueToken } from '@nestjs/bullmq';

describe('Entries integration', () => {

    let controller : EntriesController;

    const mockEntriesRepository = {
  findByToken: jest.fn(),
  create: jest.fn(),
  findActive: jest.fn(),
  findCompleted: jest.fn(),
  findLastInQueue: jest.fn(),
  countAhead: jest.fn(),
  findByStatus: jest.fn(),
  findNextWaiting: jest.fn(),
  findSecondWaiting: jest.fn(),
  findByIdAndAdmin: jest.fn(),
  updateById: jest.fn(),
  updateByToken: jest.fn(),
};

const queueId = 'test-queue-id';
    const mockJwtService = {
    verify: jest.fn(),
  };
  const mockQueuesRepository = 
  {
    //returns a queue
    findById: jest.fn(async (queueId:string) => 
        {
            return { id: queueId, name: 'Test Queue', isOpen: true, adminId: 'admin-id-123' };
        }),
  }
  const mockQueueGateway = {
    
  notifyQueueUpdate: jest.fn(),
};
  const mockNotifQueue = {
  add: jest.fn(),
};
    beforeEach(async () => 
        {
            jest.clearAllMocks();
            const module : TestingModule = await Test.createTestingModule({
                controllers : [EntriesController],
                providers : [EntriesService,
                    { provide: JwtService , useValue: mockJwtService},
                    {provide :EntryRepository , useValue: mockEntriesRepository},
                    {provide : QueueRepository , useValue: mockQueuesRepository},
                    {provide : QueueGateway, useValue: mockQueueGateway},
                    {provide: getQueueToken('notifications'),useValue: mockNotifQueue,}

                    
                ],
            }).compile();
            controller = module.get<EntriesController>(EntriesController);
        });

        it('should be defined', () => {expect(controller).toBeDefined(); });

        it('should join a queue' , async () => 
        {
            const dto = {name: 'test name',email: 'test@example.com' }

            //findOpenById queue (done)
            //findLastInQueue entry 
            //create entry 
            //find active
            // notifyQueueUpdate
            const queueId = 'test-queue-id';
           const queue =     await mockQueuesRepository.findById(queueId);
           expect(queue).toEqual({ id: queueId, name: 'Test Queue', isOpen: true, adminId: 'admin-id-123' });


        })

    
});