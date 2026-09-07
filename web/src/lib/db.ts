import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as { _isilMongoose?: MongooseCache }

const cache: MongooseCache = globalForMongoose._isilMongoose ?? { conn: null, promise: null }
globalForMongoose._isilMongoose = cache

export async function connectDB() {
  if (cache.conn) return cache.conn
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { dbName: 'BlogData' })
  }
  cache.conn = await cache.promise
  return cache.conn
}
