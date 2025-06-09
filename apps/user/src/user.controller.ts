import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
// import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login() {
    return this.userService.login();
  }
}
