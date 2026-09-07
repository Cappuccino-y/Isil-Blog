import mongoose, { Schema, model, models } from 'mongoose'

export interface IComment {
  name: string
  content: string
  id: string
  date: Date
}

export interface IBlog {
  _id: mongoose.Types.ObjectId
  title?: string
  content?: string
  tag?: string
  likes?: number
  date: Date
  user: mongoose.Types.ObjectId
  visible: string[]
  comments: IComment[]
  summary?: string
  views?: number
}

export interface IUser {
  _id: mongoose.Types.ObjectId
  username: string
  name: string
  passwordHash: string
  blogs: mongoose.Types.ObjectId[]
}

const jsonTransform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id)
  delete ret._id
  delete ret.__v
  return ret
}

const blogSchema = new Schema({
  title: String,
  content: String,
  tag: String,
  likes: Number,
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  visible: [String],
  comments: [
    {
      name: String,
      content: String,
      id: String,
      date: { type: Date, default: Date.now },
    },
  ],
  summary: String,
  views: Number,
})

blogSchema.set('toJSON', { transform: jsonTransform as never })

const userSchema = new Schema({
  username: { type: String, unique: true },
  name: { type: String, unique: true },
  passwordHash: String,
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
})

const userJsonTransform = (_doc: unknown, ret: Record<string, unknown>) => {
  jsonTransform(_doc, ret)
  delete ret.passwordHash
  return ret
}

userSchema.set('toJSON', { transform: userJsonTransform as never })

export const Blog = (models.Blog || model<IBlog>('Blog', blogSchema)) as mongoose.Model<IBlog>
export const User = (models.User || model<IUser>('User', userSchema)) as mongoose.Model<IUser>
