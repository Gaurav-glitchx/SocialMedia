import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserSession extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop()
  deviceId?: string; 
  
  @Prop({ default: 'active' }) // active | expired | revoked
  status: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
