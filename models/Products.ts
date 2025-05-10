import { mongo, ObjectId, Schema } from "mongoose";
import mongoose from "mongoose";

export interface Product extends Document {
    businessId : ObjectId,
    name : string,
    price : number,
    profit : number,
    category : string,
    createdAt : Date
}

const ProductScheam : Schema<Product> = new Schema({
    businessId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Business",
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    profit : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
})

const ProudctModel = (mongoose.models.Product as mongoose.Model<Product>) || mongoose.model<Product>("Product",ProductScheam)
export default ProudctModel