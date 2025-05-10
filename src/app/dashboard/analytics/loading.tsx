import React from 'react'
import { Loader2 } from 'lucide-react'
const loading = () => {
  return (
    <div className='flex flex-col gap-2 items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Loading...</h1>
      <Loader2 className='animate-spin' />
    </div>
  )
}

export default loading
