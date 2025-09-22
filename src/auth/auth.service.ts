import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
   
    async register(dto: RegisterDto) {
       const hashedPassword = await bcrypt.hash(dto.password, 10);

       const customerRole = await this.prisma.role.findUnique({
        where: { name: 'CUSTOMER'},
       });

       if (!customerRole) {
        throw new InternalServerErrorException('role CUSTOMER not found.',);
       }

       const user = await this.prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            roleId: customerRole.id,
        },
       });

       return {message: 'User registered successfully', userId: user.id };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { role: true },
        });

        if (!user) throw new UnauthorizedException('Wrong Credentials');

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Wrong Credentials');

        const payload = { sub: user.id, email: user.email, role: user.role.name };
        const token = this.jwtService.sign(payload);

        return { access_token: token};
    }
}
