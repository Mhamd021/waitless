import {
  Controller, Get, Post, Patch,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { JoinQueueDto } from './dto/join-queue.dto';
import { JwtGuard } from '../admin/jwt.guard';

@Controller()
export class EntriesController {
  constructor(private service: EntriesService) {}

  
  @Post('queues/:queueId/join')
  join(
    @Param('queueId') queueId: string,
    @Body() dto: JoinQueueDto,
  ) {
    return this.service.join(queueId, dto);
  }

  @Get('track/:token')
  getStatus(@Param('token') token: string) {
    return this.service.getStatus(token);
  }

  @Patch('track/:token/leave')
  leave(@Param('token') token: string) {
    return this.service.leave(token);
  }


  @Get('queues/:queueId/entries')
  @UseGuards(JwtGuard)
  findAll(
    @Param('queueId') queueId: string,
    @Request() req: any,
  ) {
    return this.service.findAll(queueId, req.user.sub);
  }

  @Patch('queues/:queueId/next')
  @UseGuards(JwtGuard)
  callNext(
    @Param('queueId') queueId: string,
    @Request() req: any,
  ) {
    return this.service.callNext(queueId, req.user.sub);
  }

  @Patch('entries/:id/complete')
  @UseGuards(JwtGuard)
  complete(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.service.complete(id, req.user.sub);
  }

@Patch('queues/:queueId/arrived')
@UseGuards(JwtGuard)
confirmArrival(
  @Param('queueId') queueId: string,
  @Request() req: any,
) {
  return this.service.confirmArrival(queueId, req.user.sub);
}

@Patch('queues/:queueId/no-show')
@UseGuards(JwtGuard)
markNoShow(
  @Param('queueId') queueId: string,
  @Request() req: any,
) {
  return this.service.markNoShow(queueId, req.user.sub);
}
}