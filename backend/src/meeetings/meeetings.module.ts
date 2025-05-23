import { Module } from '@nestjs/common';
import { MeetingsController } from './meeetings.controller';
import { MeetingsService } from './meeetings.service';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
   imports:[PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeeetingsModule {}
