'use client'
import FillBusinessDetails from "@/app/Components/FillBusinessDetails"
import { useSession } from "next-auth/react"
import SignIn from "@/app/Components/SignIn/page"
import { useRouter } from "next/navigation"
export default function FillBusinessDetailsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    if(session?.user.isProfileComplete) {
       router.push("/dashboard")
    }
    if (!session) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-3xl font-bold'>Unauthorized</h1>
                <SignIn></SignIn>
            </div>
        )
    }
    const userId = session.user.id 
    return <FillBusinessDetails userId={userId} />
  } 