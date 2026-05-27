import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Request, UseGuards,
  Res,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { JwtGuard } from '../admin/jwt.guard';
import * as QRCode from 'qrcode';

@Controller('queues')
@UseGuards(JwtGuard) 
export class QueuesController {
  constructor(private service: QueuesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.service.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.service.findOne(id, req.user.sub);
  }
 
@Get(':id/qrcode')
async getQrCode(@Param('id') id: string) {
  const joinUrl = `http://localhost:3000/join/${id}`;
  const qr = await QRCode.toDataURL(joinUrl); 
  return { qr };
}

  @Post()
  create(@Body() dto: CreateQueueDto, @Request() req: any) {
    return this.service.create(req.user.sub, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQueueDto,
    @Request() req: any,
  ) {
    return this.service.update(id, req.user.sub, dto);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string, @Request() req: any) {
    return this.service.toggleOpen(id, req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.service.delete(id, req.user.sub);
  }

}