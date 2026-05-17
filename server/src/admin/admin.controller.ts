import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
  constructor(private service: AdminService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}