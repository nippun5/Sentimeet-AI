import { Controller, Post, Body, Param, Put,Get } from '@nestjs/common';
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

  @Put('/analysis/:id')
  async updateMeetingTask( @Param('id') id: string,) {
    return this.meetingsService.analysis(id);
  }


  @Get()
  async findAllMeetingsWithCount() {
    return this.meetingsService.findAllMeetingsWithCount();
  }

  @Get('/meetingTasks/:id')
  async findAllMeetingTasks(@Param('id') id: string,) {
    return this.meetingsService.findMeetingTaskById(id);
  }
}
