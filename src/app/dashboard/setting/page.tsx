'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
const Setting = () => {
  return (
    <div className='md:ml-40 border-amber-100 bg-sky-50 rounded m-10 p-2 shadow dark:bg-gray-800 dark:text-white'  >
      <div className='flex justify-center contain-content items-center mb-10'>
          <h1 className='text-indigo-600 text-2xl font-semibold dark:text-white'>Settings</h1>
      </div>
      <div className='flex flex-row gap-4 mb-4'>
        <label htmlFor="">Logout</label>
          <Button className='cursor-pointer bg-blue-600 rounded dark:text-black dark:bg-white' onClick={()=>signOut()}>signOut</Button>
      </div>
    </div>  
  )
}

export default Setting
