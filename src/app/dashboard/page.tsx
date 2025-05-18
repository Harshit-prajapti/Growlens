
import React from 'react'
import connectDb from '@/lib/db'
import { getServerSession } from 'next-auth'
import authOptions from '../api/auth/[...nextauth]/options'
import BusinessModel from '../../../models/BusinessModel'
import SignIn from '../Components/SignIn/page'
import UserModel from '../../../models/userModel'
import Image from 'next/image'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
// import Image from 'next/image'
import { CardContent, Card, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
export default async function Dashboard() {
  await connectDb()
  const session = await getServerSession(authOptions)
  console.log("This is the session : ",session?.user)
  if(!session){
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold'>Unauthorized</h1>
        <SignIn></SignIn>
      </div>
    )
  }
  const user = await UserModel.findById(session.user.id) 
  console.log(user)
  if(!user){
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold'>Unauthorized</h1>
        <SignIn></SignIn>
      </div>
    )
  }
  if(!session.user.isProfileComplete){
    redirect("/dashboard/fillBusinessDetails")
  }
  const img = session.user.image
  const business = await BusinessModel.findById(user.businessId)
  return (
    <div className='md:ml-40 mt-10'>
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between w-full'>
          <div>
        <CardTitle className='text-semibold text-3xl text-indigo-600'>{business?.name}</CardTitle>
        <CardDescription className='text-sm text-gray-500'>{business?.location}</CardDescription>
        <CardDescription className='text-sm text-gray-500'>{business?.industryType}</CardDescription>
        </div>
        <div>
        {img ? (<>
          <img
            src={img || "/images/download.png"}
            width={30}
            height={30}
            className="cursor-pointer rounded-2xl"
          />
        </>) : (<>
        <Image
            src={"/images/download.png"}
            alt="Admin"
            width={30}
            height={30}
            style={{ cursor: "pointer" }}
          />
        </>)}
        </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-600'>Welcome Mr. {session?.user.name}</h1>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-600'>Your Business</h1>
          <p><strong>Name:</strong> {business?.name}</p>
          <p><strong>Industry:</strong> {business?.industryType}</p>
          <p><strong>Location:</strong> {business?.location}</p>
          <p><strong>Employees:</strong> {business?.numEmployee}</p>
          <p><strong>Annual Revenue:</strong> ₹{business?.annualRevenue.toLocaleString()}</p>
          <p><strong>Monthly Sales:</strong> ₹{business?.monthlySales.toLocaleString()}</p>
          <p><strong>Customer Type:</strong> {business?.customerType}</p>
          <p><strong>Pain Points:</strong> {business?.painPoints?.join(", ") || "N/A"}</p>
          <p><strong>Growth Goals:</strong> {business?.growthGoals?.join(", ") || "N/A"}</p>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='font-bold text-gray-500'>Your Business Email is : {user?.email}</h1>
          <p>Created by Harshit Kumbhkar</p>
          <p className="mt-1">
            📱 +91 9039140984 &nbsp; | &nbsp;
            📸 <a href="https://instagram.com/mr.harshprajapti" target="_blank" className="text-indigo-600 hover:underline">Instagram</a>
          </p>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
