import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { UUID } from 'crypto';

export class CreateUserDto {
    @ApiProperty()
    @IsNumber()
    id: UUID;

    
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

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id?: UUID;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstname?: string;

    @ApiProperty()  
    @IsOptional()
    @IsString()
    lastname?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string;
}
