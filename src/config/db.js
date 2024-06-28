import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async (urlKey = 'MONGO_URL') => {
    try {
        const conn = await mongoose.connect(process.env[urlKey])
        console.log(`MongoDB Connected: ${conn.connection.host} using ${urlKey}`)
    } catch (error) {
        console.error('Error en la conexión', error)
        process.exit(1)
    }
}

export default connectDB