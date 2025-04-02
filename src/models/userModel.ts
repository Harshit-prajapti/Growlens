import mongoose from "mongoose"
import { ObjectId } from "mongoose";
import { Schema} from "mongoose"

export interface User extends Document {
    username : string;
    createdAt : Date;
    fullname : string;
    email : string;
    avatar : string;
    mobileNumber : number;
    provider : "google" | "github" | "twitter";
    role : "user" | "admin";
    businessId : ObjectId
}
const UserSchema : Schema<User> =  new Schema({
    username : {
        type : String,
        require : true,
        unique : true,
    },
    businessId : {
        type : Schema.Types.ObjectId,
        ref : "BusinessModel"
    },
    email : {
        type : String,
        require : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    },
    fullname : {
        type : String,
    },
    avatar : {
        type : String,
    },
    mobileNumber : {
        type : Number,
    },
    provider : {
        type : String        
    },
    role : {
        type : String
    }
})
UserSchema.pre("save", async function(next){
    if(!this.isModified()){
        return next
    }
})

const UserModel =(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("user",UserSchema)
export default UserModel