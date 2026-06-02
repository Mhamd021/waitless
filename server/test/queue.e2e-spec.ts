import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe,it, jest } from "@jest/globals";
import { QueuesModule } from '../src/queues/queues.module';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from '../src/admin/admin.module';


describe('QueuesController (e2e)', () => {
  let app: INestApplication<App>;

          const mockJwtService = {verify: jest.fn()};
  

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [QueuesModule, AdminModule],
      providers: [
       

      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/queues (GET)', () => {
    return request(app.getHttpServer())
      .get('/queues')
      .expect(200)
  });
});

//integration tests - then E2E tests