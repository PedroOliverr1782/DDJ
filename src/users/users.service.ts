import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // eslint-disable-next-line
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // eslint-disable-next-line
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    // eslint-disable-next-line
    const { password, ...userSemSenha } = user;
    // eslint-disable-next-line
    return userSemSenha;
  }

  findByEmail(email: string) {
    // eslint-disable-next-line
    return this.prisma.user.findUnique({ where: { email } });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  // eslint-disable-next-line
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
