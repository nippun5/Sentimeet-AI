import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeeting.dto';
import { UpdateMeetingDto } from './dto/update-meeeting.dto';


@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  // Create a new meeting
  async createMeeting(createMeetingDto: CreateMeetingDto) {
    const { title, description, participants } = createMeetingDto;
  
    const newMeeting = await this.prisma.meeting.create({
      data: {
        title,
        description,
        
      },
      select: {
        id: true,
        title: true,
        description: true,
        participants: {
          select: {    
            user: true,
          },
        },
      },
    });
    console.log(newMeeting,".......................")
    const newParticipants = await this.prisma.meetingParticipants.createMany({
      data: participants.map((participants) => ({
        meetingId: newMeeting.id,
        userId: participants.userId,
      })),
    })
  
    return await this.prisma.meeting.findUnique({
      where: { id: newMeeting.id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }
  

  async updateMeeting(id: string, updateMeetingDto: UpdateMeetingDto) {
    const { title, description, participants } = updateMeetingDto;

    const updatedMeeting = await this.prisma.meeting.update({
      where: { id },
      data: {
        title,
        description,
        participants: participants
          ? {
              deleteMany: {}, // remove all existing participants
              create: participants.map((userId) => ({
                user: {
                  connect: { id: userId },
                },
              })),
            }
          : undefined,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return updatedMeeting;
  }
}
