'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { LineChart, Line} from 'recharts';
import {Select,SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useEffect, useState } from "react";
import axios from 'axios';
export const dynamic = 'force-dynamic'
import Loading from '@/app/Components/Loading';
interface Data {
  _id: string;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  productName : string;
  productCategory : string;
  productPrice : number;
  productProfit : number;
}
interface Product {
  _id : string;
  date : Date;
  totalRevenue : number;
  totalProfit : number;
  totalQuantity : number
}
interface DailySales {
  _id : string;
  totalProfit : number;
  totalQuantitySold : number;
  totalRevenue : number;
  date : Date;
}
const ProductsChart = () => {
  const [data, setData] = useState<Data[]>([]);
  const[name, setName] = useState<string>("")
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [product, setProduct] = useState<Product[]>([]);
  const [type,setType] = useState<string>("totalRevenue")
  const [date , setDate] = useState<string>("Today")
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDailySales = async () => {
    const res = await axios.get("/api/analytics/datebased")
    setDailySales(res.data)
    console.log("This is the response from the daily sales route", res.data) 
  }
  const fetchProducts = async () => {
    try {
      setLoading(true)
      await axios.get(`/api/analytics/product-performance?date=${date}`).then((res) => {
        setData(res.data);
        setLoading(false)
        console.log("This is the response from the product performance route", res.data)
    })
    } catch (error) {
      console.log("Some error are occuring",error)
    }
  }
  
  useEffect(() => {
    fetchDailySales()
  },[])
  useEffect(()=>{
    fetchProducts()
  },[date])

  const handleSelect = async(name : string) => {
    setName(name)
    setProduct([])
    const getProduct = data.find((product) => product.productName === name)
    if (!getProduct) return;
    const res = await axios.get(`/api/analytics/productId?productId=${getProduct._id}`)
    setProduct(res.data)
    console.log("This is the res for " + name + " : ",res.data)
  }
  return (
    <>
    <div className='flex flex-col'>
      <div className='flex flex-row justify-center items-center content-center mb-4 h-auto w-full rounded p-2 '>
      {loading && (<>
      <Loading height={300} weidth={300}/>
      </>)}
      </div>
    <div className='md:ml-40 mt-10 h-[370] bg-white rounded shadow p-4 dark:bg-zinc-700 '>
      
      <div className='flex flex-row dark:bg-slate-600 justify-between items-center content-center mb-4 font-semibold bg-rose-500 rounded p-2 '>
      <h2 className="text-lg font-semibold mb-4 text-white">Daily Comparision</h2>
    <Select onValueChange={(Value)=> setType(Value)}>
      <SelectTrigger className="w-[180px] mb-4 text-white border-0 border-none" >
        <SelectValue className='text-white' placeholder="Select a Product" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="totalRevenue">Revenue</SelectItem> 
        <SelectItem value="totalProfit">Profit</SelectItem> 
        <SelectItem value="totalQuantitySold">Quantity</SelectItem> 
      </SelectContent>
    </Select>
      </div>
    <ResponsiveContainer className={"dark:bg-zinc-700"} width="100%" height="80%" >
      <LineChart data={dailySales} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"_id"} />
        <YAxis />
        <Tooltip/>
        <Line type="monotone" dataKey={type} stroke="#8884d8" />
      </LineChart>
      </ResponsiveContainer>
      </div>

    
    <div className="md:ml-40 dark:bg-zinc-700 mt-10 h-[420] bg-white rounded-xl shadow p-4">
    <div className='flex dark:bg-stone-500 flex-row justify-between items-center content-center mb-4 font-semibold bg-rose-500 rounded p-2 '>
      <h2 className="text-lg font-semibold mb-4 text-white">Sales</h2>
    <Select onValueChange={(Value)=> setDate(Value)}>
      <SelectTrigger className="w-[180px] mb-4 text-white border-0 border-none" >
        <SelectValue placeholder="Select a Product" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Today">Today</SelectItem> 
        <SelectItem value="This Week">This Week</SelectItem> 
        <SelectItem value="This Month">This Month</SelectItem>
        <SelectItem value="This Year">This Year</SelectItem>  
        <SelectItem value="Overall">Overall</SelectItem>
      </SelectContent>
    </Select>
      </div>
      <ResponsiveContainer className={"dark:bg-zinc-700"} width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalRevenue" fill="#4f46e5" name="Revenue" />
          <Bar dataKey="totalQuantitySold" fill="#22c55e" name="Quantity Sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>


    <div className='md:ml-40 mt-10 h-[350] dark:bg-zinc-700 bg-white rounded-xl shadow p-4'>
    <div className='flex dark:bg-slate-600 flex-row justify-between items-center content-center mb-4 font-semibold bg-sky-400 rounded p-2 '>
      <h2 className="text-lg font-semibold mb-4 text-white">Product Performance</h2>
      <h1 className='text-white font-semibold'>{name}</h1>
      <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px] border-none text-white" >
        <SelectValue className=' text-white dark:text-white dark:bg-black' placeholder="Select a Product" />
      </SelectTrigger>
      <SelectContent className='bg-white'>
        
        {
          data.map((product) => (
            <SelectItem key={product._id} value={product.productName}>
              {product.productName}
            </SelectItem>
          ))
        } 
      </SelectContent>
    </Select>
      </div>    
    <ResponsiveContainer className={"dark:bg-zinc-700"} width="100%" height="80%" >
      <LineChart data={product} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"_id"} />
        <YAxis />
        <Tooltip/>
        <Line type="monotone" dataKey="totalQuantity" stroke="#8884d8" />
        <Line type="monotone" dataKey="totalRevenue" fill="#4f46e5" stroke='#8884d8'/>
        <Line type="monotone" dataKey="totalProfit" fill="#4f46e5" stroke='#8884d8'/>
      </LineChart>
      </ResponsiveContainer>
    </div>
    </div>
    </>
  )
}

export default ProductsChart
