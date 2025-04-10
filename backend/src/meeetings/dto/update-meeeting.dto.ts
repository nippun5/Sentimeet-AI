import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpdateMeetingDto {


  @ApiProperty()
  @IsOptional()
  @IsString()
  transcription?: string;
}
