import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { MeetingsService } from './meeetings.service';
import { CreateMeetingDto } from './dto/create-meeeting.dto';
import { UpdateMeetingDto } from './dto/update-meeeting.dto';


@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // Endpoint for creating a meeting
  @Post()
  async createMeeting(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.createMeeting(createMeetingDto);
  }

  // Endpoint for updating a meeting
  @Put(':id')
  async updateMeeting(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto
  ) {
    return this.meetingsService.updateMeeting(id, updateMeetingDto);
  }
}
