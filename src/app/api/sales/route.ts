import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import DailySales from "../../../../models/DailySales";
import UserModel from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import ProudctModel from "../../../../models/Products";
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const user = await UserModel.findById(userId);
  try {
    const sales = await DailySales.aggregate([
      {
        $match: {
          businessId: user?.businessId,
        },
      },
      {
        $sort : {
            date : -1
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
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
          quantitySold: 1,
          revenue: 1,
          totalPr0fit : 1,
          date: 1,
          "product._id": 1,
          "product.name": 1,
          "product.price": 1,
          "product.category": 1,
          "product.profit": 1,
        },
      },
    ]);
    return NextResponse.json(sales, { status: 200 });
  } catch (error) {
    console.log("Some error are occuring",error);
    return NextResponse.json("Some error are occuring");
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const user = await UserModel.findById(userId);
  const { productId, quantitySold } = await req.json();
  console.log(productId, quantitySold);
  try {
    const product = await ProudctModel.findById(productId);
    let revenue = 0;
    let totalProfit = 0;
    if(product?.price){
        revenue = product?.price * quantitySold;
        totalProfit = product?.profit * quantitySold; 
    }
    const res = await DailySales.create({
      businessId: user?.businessId,
      productId: productId,
      quantitySold: quantitySold,
      revenue: revenue,
      totalProfit: totalProfit,
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 200 });
  }
}
