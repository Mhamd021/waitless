import 'dotenv/config';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise< { access_token: string } > {
 
  if (dto.secretKey !== process.env.ADMIN_REGISTER_SECRET) {
    throw new ForbiddenException('Invalid registration key');
  }

  const existing = await this.prisma.admin.findUnique({
    where: { email: dto.email },
  });
  if (existing) throw new ConflictException('Email already in use');

  const hashed = await bcrypt.hash(dto.password, 10);
  const admin = await this.prisma.admin.create({
    data: { email: dto.email, password: hashed },
  });

  return this.signToken(admin.id, admin.email);
}

  async login(dto: LoginDto): Promise<{access_token:string}> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(admin.id, admin.email);
  }

  private signToken(adminId: string, email: string) {
   
    const token = this.jwt.sign({ sub: adminId, email });
    return { access_token: token };
  }
}