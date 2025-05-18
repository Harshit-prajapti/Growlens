import React from 'react'
import Loader from '@/app/Components/Loader'
const loading = () => {
  return (
    <div className='flex flex-col gap-2 items-center justify-center h-screen'>
      <Loader/>
    </div>
  )
}
export default loading
