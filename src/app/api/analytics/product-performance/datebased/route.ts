import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import DailySales from "../../../../../../models/DailySales";
import UserModel from "../../../../../../models/userModel";
export async function GET(){
    const session  = await getServerSession(authOptions)
    const user = await UserModel.findById(session?.user.id)
    if(!user){
        return new Response("User not found", {status : 404})
    }
   const res =  await DailySales.aggregate([
        {
            $match : {
                businessId : user?.businessId
            }
        },
        {
            $group : {
                _id : {
                    $dateToString : {format : "%Y-%m-%d",date : { $add: ["$date", 330 * 60 * 1000] }}
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
                date : { $first : "$date"}   
            }
        },
        {
            $sort : {
                date : 1
            }
        }
    ])
    return NextResponse.json(res,{status : 200})
}