import { EntriesController } from "./entries.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EntriesService } from "./entries.service";
import { expect,describe, beforeEach, it, jest } from "@jest/globals";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";


describe('EntriesController', () => 
    {
        let controller: EntriesController;
        const mockEntriesService = {};
        const mockJwtService = {verify: jest.fn()};

        beforeEach( async () => {
            const module : TestingModule = await Test.createTestingModule({
                
                controllers: [EntriesController],
                providers: [
                { provide: EntriesService, useValue: mockEntriesService },
                { provide: JwtService, useValue: mockJwtService },
]
            }).compile();   

            controller = module.get<EntriesController>(EntriesController);
        });
      
 it('should be defined', () => {
            expect(controller).toBeDefined();
        });

       
});
