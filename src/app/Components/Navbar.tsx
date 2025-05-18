"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function Navbar() {
  const { data: session } = useSession();
  const img = session?.user.image as string
  return (
    <nav className="fixed w-full bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center top-0 z-10">
      <h1 className="text-xl dark:text-white font-bold text-blue-600">Grouth Lance</h1>
      <div className="flex items-center gap-4">
        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
          {session?.user?.role || "user"}
        </span>
        <Link href="/dashboard">
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
          
        </Link>
      </div>
    </nav>
  );
}
