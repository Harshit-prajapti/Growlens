import mongoose from "mongoose"
import { ObjectId } from "mongoose";
import { Schema} from "mongoose"
import { string } from "zod";

export interface User extends Document {
    createdAt : Date;
    fullname : string;
    username : string;
    email : string;
    avatar : string;
    mobileNumber : number;
    provider : "google" | "github" | "twitter";
    role : "user" | "admin";
    businessId : ObjectId;
    password : string;
    isProfileComplete : boolean;
}
const UserSchema : Schema<User> =  new Schema({
    email : {
        type : String,
        require : true,
        unique : true,
        lowercase : true,
    },
    businessId : {
        type : Schema.Types.ObjectId,
        ref : "BusinessModel"
    },
    fullname : {
        type : String,
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
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
    password : {
        type : String,
    },
    role : {
        type : String,
        enum : ["user","premium","admin"],
        default : "user"
    },
    isProfileComplete : {
        type : Boolean,
        default : false
    }
},{
    strict : true
})
UserSchema.pre("save", async function (next) {
  next(); // Always call next unless you are throwing an error
});


const UserModel =(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)
export default UserModel