import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@ObjectType()
@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class User extends Document {
  @Field()
  @Prop({ required: true })
  name: string

  @Field()
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string

  @Field()
  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ create_at: -1 })
