import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeeting.dto';
import { UpdateMeetingDto } from './dto/update-meeeting.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { response } from 'express';

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
      where:{id:meetingId}
     })

     // meetingTranscription?.transcription
     //call gemini 

    //  const update = await this.prisma.meeting.update({
    //   where:{id:meetingId}
    //  })

   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

 
    try {
        const { transcript } = req.body;

        if (!transcript || typeof transcript !== "string") {
            return res.status(400).json({ error: "transcript (string) is required" });
        }

        const prompt = `
Extract tasks and deadlines from the following meeting transcript. 
Return only valid JSON. Do NOT include any markdown or code blocks like \`\`\`. 
Use the format: 
[
  {
    "assignee": "Name",
    "task": "Task description",
    "deadline": "Due date"
  }
]

Transcript:
${transcript}
        `.trim();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean code block formatting if Gemini returns it anyway
        text = text.replace(/```json|```/g, "").trim();

        // Parse and return as JSON
        const tasks = JSON.parse(text);
        return response.json({ tasks });
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return response.status(500).json({ error: "Failed to process the request" });
    }





    // return updatedMeeting;
  }
}
