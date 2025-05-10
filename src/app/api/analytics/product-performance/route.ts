import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import UserModel from "../../../../../models/userModel";
import DailySales from "../../../../../models/DailySales";
import { ObjectId } from "mongoose";
interface MatchStage {
  businessId: ObjectId | undefined;
  date?: {
    $gte: Date;
    $lt: Date;
  };
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  console.log("This is the date : ", date);
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json("User not found", { status: 404 });
  }
  const user = await UserModel.findById(userId);
  const matchStage: MatchStage = {
    businessId: user?.businessId,
  };
  const now = new Date();
const startOfISTDayUTC = new Date(now);
startOfISTDayUTC.setUTCHours(18, 30, 0, 0); // 18:30 UTC = 00:00 IST

// If current UTC time is before today's 18:30 UTC, move start to yesterday's 18:30 UTC
if (now < startOfISTDayUTC) {
  startOfISTDayUTC.setUTCDate(startOfISTDayUTC.getUTCDate() - 1);
}
// Convert current UTC to IST
// Helper to convert IST datetime to corresponding UTC
  if (date === "Today") {
    const nowUTC = new Date(); // current UTC time

    const startOfISTDay = new Date();
    startOfISTDay.setUTCHours(18, 30, 0, 0); // 12:00 AM IST == 18:30 UTC
  
    // If current UTC time is before 18:30, shift to previous day's IST
    if (nowUTC < startOfISTDay) {
      startOfISTDay.setUTCDate(startOfISTDay.getUTCDate() - 1);
    }
  
    matchStage.date = {
      $gte: startOfISTDay,
      $lt: nowUTC,
    };
  }else if (date === "This Week") {
    const istStart = new Date(startOfISTDayUTC);
    const dayOfWeek = istStart.getUTCDay(); // Sunday = 0
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    istStart.setUTCDate(istStart.getUTCDate() + diffToMonday);
    
    const startOfWeekUTC = new Date(istStart);
    const endOfWeekUTC = new Date(startOfWeekUTC);
    endOfWeekUTC.setUTCDate(endOfWeekUTC.getUTCDate() + 7);
  
    matchStage.date = {
      $gte: startOfWeekUTC,
      $lt: endOfWeekUTC,
    };
  }
  
  else if (date === "This Month") {
    const startOfMonthIST = new Date(startOfISTDayUTC);
    startOfMonthIST.setUTCDate(1);
    const startOfMonthUTC = new Date(startOfMonthIST);
  
    const startOfNextMonthUTC = new Date(startOfMonthUTC);
    startOfNextMonthUTC.setUTCMonth(startOfNextMonthUTC.getUTCMonth() + 1);
  
    matchStage.date = {
      $gte: startOfMonthUTC,
      $lt: startOfNextMonthUTC,
    };
  }
  
  else if (date === "This Year") {
    const startOfYearIST = new Date(startOfISTDayUTC);
    startOfYearIST.setUTCMonth(0, 1); // Jan 1
    const startOfYearUTC = new Date(startOfYearIST);
  
    const startOfNextYearUTC = new Date(startOfYearUTC);
    startOfNextYearUTC.setUTCFullYear(startOfNextYearUTC.getUTCFullYear() + 1);
  
    matchStage.date = {
      $gte: startOfYearUTC,
      $lt: startOfNextYearUTC,
    };
  }
  console.log("This is the match stage : ", matchStage);
  const data = await DailySales.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: "$productId",
        totalRevenue: {
          $sum: "$revenue",
        },
        totalProfit: {
          $sum: "$totalProfit",
        },
        totalQuantitySold: {
          $sum: "$quantitySold",
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalProfit: 1,
        totalQuantitySold: 1,
        productName: "$product.name",
        productPrice: "$product.price",
        productCategory: "$product.category",
        productProfit: "$product.profit",
      },
    },
  ]);
  return NextResponse.json(data, { status: 200 });
}
