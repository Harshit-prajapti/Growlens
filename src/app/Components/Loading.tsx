'use client'
import React from 'react'
import Lottie from "react-lottie"
import animationData from "@/lottie/loading.json"
interface props {
  height : number,
  weidth : number
}
const Loading: React.FC<props> = ({height = 400,weidth = 400}) => {
  console.log("This is the height and width",height,weidth)
  const defaultOption = {
    loop : true,
    autoplay : true,
    animationData : animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
  }
  return (
    <div className='flex flex-col gap-2 items-center justify-center h-screen'>
      <Lottie 
      options={defaultOption}
      height={height}
      width={weidth}
      />
    </div>
  )
}

export default Loading
