import mongoose from "mongoose"
const connectDb = async () => {
    if(mongoose.connection.readyState === 1) {
        console.log("MongoDB already connected")
        return mongoose.connection.asPromise()
    }
    try{
        const res = await mongoose.connect(process.env.MONGO_URI as string)
        console.log("MongoDB connected : ", res.connection.host)
    }catch(err){    
        console.error("MongoDB connection error", err)
        process.exit(1)
    }
}   

export default connectDb