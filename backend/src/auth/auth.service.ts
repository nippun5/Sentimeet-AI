import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { AuthDto, LoginDto } from './dto';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-auth.dto';
export type TokenType = {
  emailname?: string;
  firstname?: string;
  access_token: string;
  refresh_token: string;
};
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // -----------------register user to database-------------------
  async register(dto: CreateUserDto): Promise<TokenType> {
    console.log("here..................")
    const { email, password, firstname, lastname } = dto;

    // await this.checkUniqueEmail(email);
    // await this.checkUniqueUsername(username);
    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        firstname,
        lastname,
      },
      select: {
        email: true,
        firstname: true,
        id: true,
      },
    });

    const { access_token, refresh_token } = await this.generateToken(
      newUser.id,
      newUser.email,
      newUser.firstname||'',
      
    );
    await this.storeHashedRT(newUser.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  // -----------------login user -----------------------------
  // async login(dto: CreateUserDto): Promise<TokenType> {
  //   const { email, password } = dto;
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: email,
  //     },
  //   });

  //   if (!user) throw new NotFoundException('User is not registered');

  //   const isPasswordMatch = await bcrypt.compare(password, user.password);

  //   if (!isPasswordMatch)
  //     throw new ForbiddenException('Password does not match');

  //   const tokens = await this.generateToken(user.id, user.email, user.firstname||'');
  //   await this.storeHashedRT(user.id, tokens.refresh_token);

  //   return { firstname: user.firstname||"", ...tokens };
  // }

  async login(dto: CreateUserDto): Promise<TokenType & { stream_token: string }> {
    const { email, password } = dto;
  
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) throw new NotFoundException('User is not registered');
  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new ForbiddenException('Password does not match');
  
    const tokens = await this.generateToken(user.id, user.email, user.firstname || '');
    await this.storeHashedRT(user.id, tokens.refresh_token);
  
    // ✅ Generate Stream Video user token manually
    const stream_token = jwt.sign(
      { user_id: user.id }, // must include user_id
      process.env.STREAM_SECRET!,
      { algorithm: 'HS256', expiresIn: '1h' }
    );
  
    return {
      firstname: user.firstname || '',
      ...tokens,
      stream_token,
    };
  }
  

  //------------------logout---------------------------------
  async logout(userId: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  //------------------refresh---------------------------------
  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.password) throw new ForbiddenException('Access denied');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken||'');
    if (!isMatch) throw new ForbiddenException('Access denied');

    const { access_token, refresh_token } = await this.generateToken(
      user.id,
      user.email,
      user.firstname||'',
    );
    await this.storeHashedRT(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  //------------------helpers---------------------------------

  // generate refresh and access token
  async generateToken(
    id: string,
    email: string,
    firstname: string,
  ): Promise<TokenType> {
    const access_token = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        firstname:firstname ,
      },
      {
        secret: this.config.get('ACCESS_SECRET'),
        // expiresIn: 60 * 15,
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        firstname: firstname,
      },
      {
        secret: this.config.get('REFRESH_SECRET'),
        expiresIn: 60 * 15,
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  // store refresh token hashed to db
  async storeHashedRT(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashed,
      },
    });
  }

  async checkUniqueEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
    if (user) throw new ConflictException('Email already registered');

    return true;
  }

  async checkUniqueUsername(firstname: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        firstname: {
          equals: firstname,
          mode: 'insensitive',
        },
      },
    });

    if (user) throw new ConflictException('Username already exists');
    return true;
  }
}