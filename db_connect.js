import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME

if (!uri) {
  throw new Error('Erro: Definir o MONGODB_URI no arquivo .env.')
}

let isConnected = false

export async function connectDb() {
  if (isConnected) {
    return mongoose.connection
  }

  await mongoose.connect(uri, {
    dbName
  })

  isConnected = true
  return mongoose.connection
}
