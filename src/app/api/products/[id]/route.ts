import { NextRequest, NextResponse } from "next/server";
import ProudctModel from "../../../../../models/Products";
export async function DELETE(req:NextRequest,{params} : {params : {id : string}}){
    const id = params.id;
    try {
        const res = await ProudctModel.findByIdAndDelete(id)
        console.log("this is the deleted item",res)
        if(res){
            return NextResponse.json("product delete successfully",{status : 200})
        }
    } catch (error) {
        return NextResponse.json(error,{status : 400})
    }
}

export async function PUT(req:NextRequest,{params} : {params : {id : string}}){
    const id = await params.id
    const { name, category, price, profit} = await req.json();
    console.log('this is the data that we get : ',name,category,price,profit)
    if(!id){
    console.log("This is the id for the updaton",id)
      return NextResponse.json("editing Id is not reachable",{status : 400})
    }
    try {
      const res = await ProudctModel.findByIdAndUpdate(id,{name,category,price,profit},{new : true})
      console.log("this is the response : ",res)
      return NextResponse.json(res,{status : 200})
    } catch (error) {
      return NextResponse.json(error,{status: 200})
    }
  }