import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @GrpcMethod('AuthService', 'GenerateToken')
  async generateToken(data: GenerateTokenDto) {
    const result = await this.authService.generateToken(data);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(data: { access_token: string }) {
    return this.authService.validateToken(data.access_token);
  }
}
