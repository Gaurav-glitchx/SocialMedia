import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User } from './schemas/user.schema';
// import * as bcrypt from 'bcrypt';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
// import { TokenResponse } from '';
// import { LoginDto } from './dto/login.dto';

interface AuthServiceClient {
  GenerateToken(data: {
    userId: string;
    email: string;
    role: string;
    deviceId: string;
    ipAddress: string;
    userAgent: string;
  }): Observable<TokenResponse>;
}
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class UserService {
  private authService: AuthServiceClient;

  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }
  

  async login(): Promise<TokenResponse> {
    // const user = await this.userModel.findOne({ email: dto.email });
    // if (!user) throw new UnauthorizedException('Invalid credentials');

  // const isMatch = await bcrypt.compare(dto.password, user.password);
    // if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token$ = this.authService.GenerateToken({
      userId: "2934",
      email: "akshat@gmail.com",
      role: "user",
      deviceId: "test-device",
      ipAddress: "127.0.0.1",
      userAgent: "PostmanRuntime/7.29.0"
    });

    const tokens = await lastValueFrom(token$);
    console.log(tokens)
    return tokens;
  }
}
