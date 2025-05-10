'use client'
import { signIn } from "next-auth/react"
import React from 'react'

const SignInBtn = () => {
  return (
    <button className=" cursor-pointer bg-blue-500 text-white rounded px-1 py-2 font-bold" onClick={()=>{signIn()}}>Login</button>
  )
}

export default SignInBtn
