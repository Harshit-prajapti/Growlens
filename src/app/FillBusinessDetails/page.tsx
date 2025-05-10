'use client'
import React, { useState } from 'react'
import { z } from "zod"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const schema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(20, "Name is too long"),
  industryType: z.string().min(1, "Industry type is required"),
  location: z.string().min(1, "Location is required"),
  numEmployee: z.string().min(1, "Number of employees is required"),
  annualRevenue: z.coerce.number().min(1, "Annual revenue is required"),
  monthlySales: z.coerce.number().min(1, "Monthly sales is required"),
  customerType: z.string(),
})

export default function FillBusinessDetails({userId} : {userId : string}){
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    industryType: "",
    location: "",
    numEmployee: "",
    annualRevenue: 0,
    monthlySales: 0,
    customerType: "B2C",
    painPoints: [""],
    growthGoals: [""],
  });
  const handleSubmit = async () => {
    setError("")
    console.log("i am called")
    const validation = schema.safeParse(form)
    if(!validation.success){
      console.log("i was invoked")
      setError(validation.error.errors[0].message)
    } else{
      const res = await axios.post("/api/business",{...form,userId},{
        headers : {
          "Content-Type" : "multipart/form-data"
        }
      })
      if( res.status !== 200){
      window.alert("Something went wrong")
    }
    router.replace("/dashboard")
    }    
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <Card className="w-full max-w-3xl shadow-md rounded-lg bg-white">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Fill Yours Business Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Business Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={(e)=>{setForm({...form,name : e.target.value})}}
              required
            />
          </div>
          <div>
            <Label>Industry Type</Label>
            <Input
              name="industryType"
              value={form.industryType}
              onChange={(e)=>{setForm({...form,industryType : e.target.value})}}
              required
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={form.location}
              onChange={(e)=>{setForm({...form,location : e.target.value})}}
              required
            />
          </div>
          <div>
            <Label>Numumber Employee</Label>
            <Input
              type="text"
              name="numEmployee"
              value={form.numEmployee}
              onChange={(e)=>{setForm({...form,numEmployee : e.target.value})}}
              required
            />
          </div>
          <div>
            <Label>Annual Revenue</Label>
            <Input
              name="annualRevenue"
              type='number'
              value={form.annualRevenue}
              onChange={(e)=>{setForm({...form,annualRevenue : Number(e.target.value)})}}
            />
          </div>
          <div>
            <Label>Monthly Sales</Label>
            <Input
              type="number"
              name="monthlySales"
              value={form.monthlySales}
              onChange={(e)=>{setForm({...form,monthlySales : Number(e.target.value)})}}
              required
            />
          </div>
          <div>
            <Label>Customer Type</Label>
            <Input
              type="text"
              name="customerType"
              value={form.customerType}
              onChange={(e)=>{setForm({...form,customerType : e.target.value})}}
              required
            />
          </div>
        </form>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {/* Centered Sign-Up Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="cursor-pointer w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </Button>
        </div>

        <div className="flex items-center my-3">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Signup Buttons */}
      </CardContent>
    </Card>
  </div>
  )
}

