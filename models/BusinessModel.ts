import mongoose, { ObjectId } from "mongoose"
import { Schema, Document } from "mongoose"
import UserModel from "./userModel";
import { timeStamp } from "console";
export interface Business extends Document{
    userId : ObjectId;
    name : string;
    industryType : string;
    location : string;
    numEmployee : string;
    annualRevenue: number;
    monthlySales: number;
    customerType: string // B2B | B2C
    painPoints: [string] // List of business challenges
    growthGoals: [string]; // List of business objectives
    createdAt: Date;
    updatedAt: Date;
}
const BusinessSchema : Schema<Business> = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "UserModel",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    industryType : {
        type : String,
        requied : true
    },
    location : {
        type : String,
        requied : true
    },
    numEmployee : {
        type : String,
        requied : true
    },
    annualRevenue : {
        type : Number,
        required : true
    },
    monthlySales : {
        type : Number,
        required : true
    },
    customerType : {
        type : String,
        enum : ["B2B","B2C"],
        required : true
    },
    painPoints : {
        type : [String],
    },
    growthGoals : {
        type : [String],
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        required :true
    },
    updatedAt : {
        type : Date,
    }
},{timestamps : true})

const BusinessModel = (mongoose.models.Business as mongoose.Model<Business>) || mongoose.model("Business",BusinessSchema)

export default BusinessModel