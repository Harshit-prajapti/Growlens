import { NextRequest } from "next/server";
import connectDb from "@/lib/db";
import DailySales from "../../../models/DailySales";
export async function POST(req:NextRequest){
    connectDb();
    const { businessId, productId, quantitySold, revenue } = await req.json();
    const res = DailySales.create({
        businessId,
        productId,
        revenue,
        quantitySold
    })
}