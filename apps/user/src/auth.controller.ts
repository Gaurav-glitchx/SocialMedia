import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";
import { LoginDto } from "./dto/login.dto";

interface LoginResponse {
  access_token: string;
  user: {
    id: any;
    email: string;
    name: string;
  };
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    console.log(loginDto);
    return this.authService.login(loginDto);
  }
}
