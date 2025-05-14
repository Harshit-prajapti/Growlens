import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import ProudctModel from "../../../../models/Products";
import UserModel from "../../../../models/userModel";
export async function GET(){
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json("Please login first",{status : 400})
    }
    const user = await UserModel.findById(session.user.id)
    console.log(user)
    if(!user){
        return NextResponse.json("user not found in data base",{status : 400})
    }
    const products = await ProudctModel.find({businessId : user.businessId})
    return NextResponse.json(products,{status : 200})
} 

export async function POST(req: NextRequest) {
    const { name, category, price, profit } = await req.json();
    console.log(name,category,profit,price)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json("Please login first", { status: 400 });
    }
    const user = await UserModel.findById(session.user.id);
    console.log("this is the user : ",user)
    if (!user) {
      return NextResponse.json("User not found in database", { status: 400 });
    }
    await ProudctModel.create({
      businessId : user.businessId,
      name,
      category,
      price,
      profit,
    });
  
    return NextResponse.json("Proudct craeted successfully",{status : 200});
  }