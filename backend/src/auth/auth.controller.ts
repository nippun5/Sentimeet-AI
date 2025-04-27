import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto) {
    console.log("signup....................")
    // const { email, password } = createAuthDto;
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateUserDto) {
    const { email, password } = createAuthDto;
    return this.authService.login(createAuthDto);
  }

}
