import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import UserModel from "../../../../../../models/userModel";
import DailySales from "../../../../../../models/DailySales";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  _request: NextRequest,
  context: { params: { productId: string } }
) {
  const session = await getServerSession(authOptions  );

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await UserModel.findById(session.user.id);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const  {productId}  = context.params;
  console.log("Product ID:", productId);

  const nowUTC = new Date();
  const startOfISTDay = new Date();
  startOfISTDay.setUTCHours(18, 30, 0, 0);
  if (nowUTC < startOfISTDay) {
    startOfISTDay.setUTCDate(startOfISTDay.getUTCDate() - 1);
  }

  const res = await DailySales.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        businessId: user.businessId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $add: ["$date", 330 * 60 * 1000] },
          },
        },
        totalRevenue: { $sum: "$revenue" },
        totalQuantity: { $sum: "$quantitySold" },
        totalProfit: { $sum: "$totalProfit" },
        date: { $first: "$date" },
      },
    },
    { $sort: { date: 1 } },
  ]);

  return NextResponse.json(res, { status: 200 });
}
