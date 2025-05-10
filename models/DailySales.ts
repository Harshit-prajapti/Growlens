import { mongo, ObjectId, Schema } from "mongoose";
import mongoose from "mongoose";

export interface Sales extends Document {
    businessId : ObjectId,
    productId : ObjectId,
    date : Date,
    quantitySold : Number,
    revenue : Number,
    totalProfit : Number
}
const DailySalesSchema : Schema<Sales> = new Schema({
    businessId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Business",   
        required : true,
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    quantitySold : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    revenue : {
    type : Number
    },
    totalProfit : {
        type : Number
    }
},{timestamps : true})

const DailySales = (mongoose.models.DailySales as mongoose.Model<Sales>) || mongoose.model<Sales>("DailySales",DailySalesSchema)
export default DailySales