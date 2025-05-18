import mongoose from "mongoose"
const connectDb = async () => {
    if(mongoose.connection.readyState === 1) {
        console.log("MongoDB already connected")
        return mongoose.connection.asPromise()
    }
    try{
        const uri = process.env.MONGO_URI as string
        if(!uri){
            console.error("MongoDB URI not found")
            process.exit(1)
        }
        const res = await mongoose.connect(uri)
        console.log("MongoDB connected : ", res.connection.host)
    }catch(err){    
        console.error("MongoDB connection error", err)
        process.exit(1)
    }
}   

export default connectDb