'use client'
import { signIn } from "next-auth/react";
import React from 'react'
import { Button } from "@/components/ui/button";
const SignIn = () => {
  return (
    <div>
      <Button className="cursor-pointer bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition" onClick={()=>signIn('google')}>Get Strated</Button>
    </div>
  )
}

export default SignIn
