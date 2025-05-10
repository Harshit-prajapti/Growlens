"use client";

import { useSession } from "next-auth/react";
export default function Navbar() {
  const { data: session } = useSession();
  console.log(session?.user)
  return (
    <nav className="fixed w-full bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center top-0 z-10">
      <h1 className="text-xl font-bold text-blue-600">Grouth Lance</h1>
      <div className="flex items-center gap-4">
        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
          {session?.user?.role || "user"}
        </span>
        <img
          onClick={() => window.location.href = "/dashboard"}
          src={session?.user?.image as string}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </nav>
  );
}
