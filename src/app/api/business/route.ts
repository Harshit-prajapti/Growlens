import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../../../models/userModel";
import BusinessModel from "../../../../models/BusinessModel";
import connectDb from "@/lib/db";
import authOptions from "../auth/[...nextauth]/options";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { trusted } from "mongoose";
export async function POST(req : NextRequest){
    connectDb();
    const session = await getServerSession(authOptions)
    if(!session){
        console.log("login please")
        return NextResponse.json("you are not logged in ",{status: 200})
    }
    const formData = await req.formData()
    const name = formData.get("name")
    const location = formData.get("location")
    const numEmployee = formData.get("numEmployee")
    const annualRevenue = formData.get("annualRevenue")
    const monthlySales = formData.get("monthlySales")
    const customerType = formData.get("customerType")
    console.log(name,location,numEmployee,annualRevenue,monthlySales,customerType)
    const res = await BusinessModel.create({
        userId : session.user.id,
        name,
        location,
        numEmployee,
        annualRevenue,
        monthlySales,
        customerType
    })
    await UserModel.findByIdAndUpdate(res._id,{businessId : res._id},{new : true})
    await UserModel.findByIdAndUpdate(session.user.id,{isProfileComplete : true})
    return  NextResponse.json("Product delete successfully",{status : 200}) 
}