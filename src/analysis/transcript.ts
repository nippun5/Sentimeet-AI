import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('generate-task')
export class Transcripts {
  constructor(private readonly authService: Transcripts) {}


  @Post('generate-task')
  async generateTast( transcript:String){
    return transcript;
  }

}