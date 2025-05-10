import ProudctModel from "../../../models/Products";
import { NextResponse,NextRequest } from "next/server";
import connectDb from "@/lib/db";
export default function handler(req : NextRequest){
    connectDb()
    const {searchParams} = new URL(req.url);
    const query = searchParams.get("businessId")
    const products = ProudctModel.find({query})
    return NextResponse.json(products,{status : 200})
}