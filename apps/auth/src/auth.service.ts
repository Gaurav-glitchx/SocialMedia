  import { Injectable } from "@nestjs/common";
  import { JwtService } from "@nestjs/jwt";
  import { Model } from "mongoose";
  import { UserSession } from "./schema/user-session.schema";
  import { InjectModel } from "@nestjs/mongoose";

  @Injectable()
  export class AuthService {
    constructor(
      private jwtService: JwtService,
      @InjectModel(UserSession.name) private sessionModel: Model<UserSession>
    ) {}

    async generateToken(payload: {
      userId: string;
      email: string;
      role: string;
      deviceId?: string;
      ipAddress?: string;
      userAgent?: string;
    }) {
      try {
        console.log('[GenerateToken] Payload:', payload);
        
      const access_token = this.jwtService.sign(payload, {
        expiresIn: "30m",
        subject: payload.userId,
      });

      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: "7d",
        subject: payload.userId,
      });

      await this.sessionModel.create({
        refreshToken: refresh_token,
        deviceId: payload.deviceId,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        userId: payload.userId,
      });

      const response = { access_token, refresh_token };
      console.log('[GenerateToken] Returning:', response);
      return response;
    } catch (err) {
      console.error('[GenerateToken] Internal Error:', err);
      throw err;
    }
    }

    validateToken(token: string) {
      const decoded = this.jwtService.verify(token);
      return {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        issuedAt: decoded.iat,
        expiresAt: decoded.exp,
      };
    }
  }
