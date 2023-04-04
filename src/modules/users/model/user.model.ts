import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class User extends Document {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ create_at: -1 })
