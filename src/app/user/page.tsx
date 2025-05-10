'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
const User = () => {
    const {data: session} = useSession()
    console.log(session?.user)
  return (
    <div>
      
    </div>
  )
}

export default User
