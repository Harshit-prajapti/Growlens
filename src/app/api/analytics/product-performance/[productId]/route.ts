import { getServerSession } from "next-auth"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import UserModel from "../../../../../../models/userModel"
import DailySales from "../../../../../../models/DailySales"
import { NextRequest, NextResponse } from "next/server"
import mongoose, { mongo } from "mongoose"
import { start } from "repl"

const IST_OFFSET_MINUTES = 330;

function toUTCFromIST(dateIST: Date) {
  return new Date(dateIST.getTime() - IST_OFFSET_MINUTES * 60 * 1000);
}

function toIST(dateUTC: Date) {
  return new Date(dateUTC.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
}

export async function GET(request: Request, { params }: { params: { productId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }
    const user = await UserModel.findById(session.user.id)
    if (!user) {
        return new Response("User not found", { status: 404 })
    }
    const {productId} = await params

    const nowUTC = new Date(); // current UTC time

    const startOfISTDay = new Date();
    startOfISTDay.setUTCHours(18, 30, 0, 0); // 12:00 AM IST == 18:30 UTC
  
    // If current UTC time is before 18:30, shift to previous day's IST
    if (nowUTC < startOfISTDay) {
      startOfISTDay.setUTCDate(startOfISTDay.getUTCDate() - 1);
    }
    const res = await DailySales.aggregate([
        {
          // $match : matchStage
            $match: {
              productId: new mongoose.Types.ObjectId(productId),
              businessId: user.businessId,
            }
          },
          {
            $group: {
              _id: {
                $dateToString : {format : "%Y-%m-%d",date : { $add: ["$date", 330 * 60 * 1000] }}
              },
              totalRevenue: { $sum: "$revenue" },
              totalQuantity: { $sum: "$quantitySold" },
              totalProfit: { $sum: "$totalProfit" },
              date: { $first: "$date" }
            }
          },
          {
            $sort: {
              date: 1  // ascending by date
            }
          }
    ])
    // console.log("This is the response from the product performance route", res)
    return NextResponse.json(res,{status : 200})

}