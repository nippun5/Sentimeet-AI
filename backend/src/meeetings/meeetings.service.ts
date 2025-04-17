import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeeting.dto';
import { UpdateMeetingDto } from './dto/update-meeeting.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { response } from 'express';
import { ConfigService } from '@nestjs/config';
import { date } from 'zod';
import { geminiPrompt } from 'src/app.constants';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService,private config: ConfigService) {}

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
if (updateMeetingDto?.transcription === undefined) {
      throw new Error('Transcription is required');
    }
    const updatedMeeting = await this.prisma.meeting.update({
      where: { id },
      data: {
        transcription: updateMeetingDto.transcription,
      },
    });

    return updatedMeeting;
  }

async analysis(meetingId: string) {
  const meetingTranscription = await this.prisma.meeting.findUnique({
    where: { id: meetingId },
  });
  
  const geminiKey = this.config.get('GEMINI_API_KEY');
  const genAI = new GoogleGenerativeAI(geminiKey);

  try {
    const transcript = meetingTranscription?.transcription;

    if (!transcript || typeof transcript !== "string") {
      return "transcript (string) is required";
    }

    const prompt = geminiPrompt+`Transcript:

    ${transcript}
    `.trim();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log(text, "text");

    // text = text.replace(/⁠ json| ⁠/g, "").trim();

    text = text.replace(/```(?:json)?|```/g, "").trim();
    const parsed = JSON.parse(text);
    

    await this.prisma.meeting.update({
      where: { id: meetingId },
      data: {
        meetingSummary: parsed.summary,
      },
    });
    await this.prisma.meetingTasks.create({
      data: {
        meetingId: meetingId,
        task: "task.task",
        deadline: "task.deadline",
      },
    })
     for (const data of parsed.meetingTask){
      await this.prisma.meetingTasks.create({
        data: {
          meetingId: meetingId,
          task: data.task,
          deadline: data.deadline,
        },
      });
     }
    

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to process the request");
  }
}


//sabai meeting haru dekhauxa aile samma vako haru
async findAllMeetingsWithCount() {
  try {
    const [meetings, totalCount] = await this.prisma.$transaction([
      this.prisma.meeting.findMany({
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prisma.meeting.count(),
      
    ]);

    return {
      totalCount,
      meetings,
    };
  } catch (error) {
    console.error("Error fetching meetings:", error.message);
    throw new Error("Failed to fetch meetings");
  }
}
async findMeetingTaskById(meetingId: string) {
  const meetingTasks = await this.prisma.meetingTasks.findMany({
    where : {
      meetingId: meetingId,
    },
    include: {
      meeting: true,
    },
  });
  return meetingTasks;

}
}
