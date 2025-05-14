import DailySales from "../../../../models/DailySales";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "../../../../models/userModel";
export async function GET(){
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json("Sesion not foun")
    }
    const user = await UserModel.findById(session.user.id)
    if(!user){
        return NextResponse.json("User not found")
    }
    const res = await DailySales.aggregate([
        {
            $match : {businessId : user?.businessId}
        },{
            $group : {
                _id : {
                    date : {$dateToString : {format : "%Y-%m-%d",date : {$add : ["$date", 330 * 60 * 1000] }}},
                    productId : "$productId"
                },
                totalRevenue : {
                    $sum : "$revenue"
                },
                totalProfit : {
                    $sum : "$totalProfit"
                },
                totalQuantitySold : {
                    $sum : "$quantitySold"
                },
                date : {$first : "$date"}
            }
        },
        {
            $lookup : {
                from : "products",
                localField : "_id.productId",
                foreignField : "_id",
                as : "product"
            }
        },
        { $unwind : "$product"},
        {
            $project : {
                _id : 0,
                date : "$_id.date",
                productName : "$product.name",
                productCategory : "$product.category",
                totalQuantitySold : 1,
                totalRevenue : 1,
                totalProfit : 1,              

            }
        },
        {
            $sort : {date : -1}
        }
    ])
    return NextResponse.json(res,{status : 200})
}