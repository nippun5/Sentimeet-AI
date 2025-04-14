import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeeting.dto';
import { UpdateMeetingDto } from './dto/update-meeeting.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { response } from 'express';
import { ConfigService } from '@nestjs/config';
import { date } from 'zod';

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

  const genAI = new GoogleGenerativeAI('AIzaSyD8iVBS7JTEeCD7GUSEngjZKfYd2OgaJBY');

  try {
    const transcript = meetingTranscription?.transcription;

    if (!transcript || typeof transcript !== "string") {
      return "transcript (string) is required";
    }

    const prompt = `
Extract tasks and deadlines from the following meeting transcript. 
Return only valid JSON. Do NOT include any markdown or code blocks like \` \`. 
Use the exact date from calendar in "mm-dd-yyyy" format using today as start date.
Calculate the days remaining to complete the task.

Use the format: 
{
  "meetingTask": [
    {
      "assignee": "Name",
      "task": "Task description",
      "deadline": "Due date",
      "days_remaining": "days remaining"
    }
  ],
  "summary": "meeting summary"
}

Transcript:
${transcript}
    `.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/⁠ json| ⁠/g, "").trim();

    const parsed = JSON.parse(text);

    await this.prisma.meeting.update({
      where: { id: meetingId },
      data: {
        meetingSummary: parsed.summary,
      },
    });

    return parsed;
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
}
