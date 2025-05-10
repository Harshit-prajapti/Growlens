'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import axios from 'axios'
interface Item {
  _id: string;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  productName : string;
  productCategory : string;
  productPrice : number;
  productProfit : number;
}
const Ai = () => {
  const [prompt , setPrompt] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const fetchDatat = async() => {
    const res = await axios.get("/api/analytics/product-performance/datebased")
    console.log("This is the response from the product performance route", res.data)
    let prompt = ""
    res.data.map((item : Item ) => {
      prompt += `On ${item._id} the total revenue is ${item.totalRevenue} and the total quantity sold is ${item.totalQuantitySold} and the total profit is ${item.totalProfit}.\n`
    })
    prompt += "What is the trend of the product with consider the leaves, market conditions and other financial fectores?"
    setPrompt(prompt)
  }
  useEffect(()=>{
    fetchDatat()
  },[])
  const handleClick = async() => {
    if(!prompt) return
    setLoading(true)
    const res = await axios.post("/api/ai",{prompt})
    console.log("This is the response from the ai route", res.data)
    setMessage(res.data.choices[0].message.content)
    setPrompt("")
    setLoading(false)
  }
    return (
    <div className='md:ml-40 top-20 h-auto bg-white rounded shadow p-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Ai</h1>
          <p className='text-sm text-gray-500'>This is the Ai page</p>
        </div>
        {loading ? (<>
          <div className='flex flex-row gap-2 items-center'>
            <Loader2 className='animate-spin' />
            <p className='text-sm text-gray-500'>Loading...</p>
          </div>
        </>) : (<>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>As you wish</h1>
          </div>
          <div className='flex flex-col gap-2'>
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </>)}
        <textarea cols={5} className={`mt-30 h-auto border-3 border-gray-500 p-3 rounded`}  value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder='Search' />
        <Button onClick={handleClick} className= 'cursor-pointer bg-blue-500 text-white'>Search</Button>
    </div>
    </div>
  )
}

export default Ai
