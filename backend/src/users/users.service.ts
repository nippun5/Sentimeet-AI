import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UUID } from 'node:crypto';
import { count } from 'node:console';




@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data:CreateUserDto ) {
    return this.prisma.user.create( {data:{
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      
    }} );
  }
  async findAll() {
    const [user,count]= await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.user.count(),
    ]);
    return { user, count };    
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data:{email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,}
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id:id },
    });
  }

  
}
