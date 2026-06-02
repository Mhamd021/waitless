import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { QueuesController } from './queues.controller';
import { QueuesService } from './queues.service';
import { QueueRepository } from './queue.repository';
import { NotFoundException } from '@nestjs/common';

describe('Queues integration', () => {
  let controller: QueuesController;

   const req = {
      user: {
        sub: 'admin-id-123',
      },
    };
  const mockQueueRepository = {
    create: jest.fn(async (adminId: string, dto: { name: string; description?: string }) => ({
      id: 'queue-id-123',
      name: dto.name,
      description: dto.description,
      adminId,
      isOpen: true,
    })),
    findAll : jest.fn(async (adminId: string) => 
    {
      return [
        {
          id: 'queue-id-123',
          name: 'Test Queue',
          description: 'A queue for testing',
          adminId,
          isOpen: true,
        },
        {
          id: 'queue-id-456',
          name: 'Test Queue2',
          description: '',
          adminId,
          isOpen:false
        }

      ]
    }
    ),
    findOne: jest.fn(
      async (id: string, adminId:string) => 
      {
        return  {
          id: id,
          name: 'Test Queue',
          description: 'A queue for testing',
          adminId,
          isOpen: true,
        }
      }
    ),
    
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueuesController],
      providers: [
        QueuesService,
        { provide: QueueRepository, useValue: mockQueueRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<QueuesController>(QueuesController);
  });

  it('creates a queue through the real controller and service', async () => {
    const dto = {
      name: 'Test Queue',
      description: 'A queue for testing',
    };
    
    const result = await controller.create(dto, req);

    expect(mockQueueRepository.create).toHaveBeenCalledWith(req.user.sub, dto);
    expect(result).toEqual({
      id: 'queue-id-123',
      name: 'Test Queue',
      description: 'A queue for testing',
      adminId: 'admin-id-123',
      isOpen: true,
    });
  });

  it('finds all queues for an admin ', async () => 
    {
     
    const result = await controller.findAll(req);

    expect(mockQueueRepository.findAll).toHaveBeenCalledWith(req.user.sub);
    expect(result).toEqual(
      [
          {
          id: 'queue-id-123',
          name: 'Test Queue',
          description: 'A queue for testing',
          adminId: req.user.sub,
          isOpen: true,
        },
        {
          id: 'queue-id-456',
          name: 'Test Queue2',
          description: '',
          adminId: req.user.sub,
          isOpen:false
        }
        
      ]
    );
    });

    it('should find one queue by id and admin', async () => {
      const result = await controller.findOne('queue-id-123', req);
      expect(mockQueueRepository.findOne).toHaveBeenCalledWith('queue-id-123', req.user.sub);
      expect(result).toEqual({
        id: 'queue-id-123',
        name: 'Test Queue',
        description: 'A queue for testing',
        adminId: req.user.sub,
        isOpen: true,
      });
    });
      
   
});
