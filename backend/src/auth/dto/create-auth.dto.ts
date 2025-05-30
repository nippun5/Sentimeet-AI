import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateUserDto {

    
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstname?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastname?: string;

    @ApiProperty()
    @IsString()
    password: string;
}

