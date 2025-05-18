"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Sidebar = () => {
  const { data: session } = useSession();

  // Derived booleans (no need for useState)
  const isPremium = session?.user.role === "premium";
  const isAdmin = session?.user.role === "admin";

  const links = useMemo(() => [
    { href: "/dashboard/analytics", icon: "/images/file.png", label: "Overview" },
    { href: "/dashboard/sales", icon: "/images/growth (1).png", label: "Sales" },
    { href: "/dashboard/analysis", icon: "/images/analysis.png", label: "Analysis" },
    { href: "/dashboard/products", icon: "/images/box.png", label: "Products" },
    { href: "/dashboard/setting", icon: "/images/settings.png", label: "Setting" },
  ], []);

  const premiumLinks = useMemo(() => [
    { href: "/dashboard", icon: "/images/file.png", label: "Advanced Forecasting" },
    { href: "/dashboard", icon: "/images/file.png", label: "Market Trends" },
  ], []);

  return (
    <div
      className={` rounded 
        fixed z-50 bg-white dark:bg-stone-800 text-black shadow-lg p-2
        flex md:flex-col md:top-14 md:left-0 md:h-screen md:w-40
        bottom-0 w-full justify-around md:justify-start md:items-center md:gap-5
      `}
    >
      {isAdmin ? (
        <Link
          href="/dashboard/admin"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-4 p-2 hover:bg-blue-500 hover:text-white rounded"
        >
          <Image height={30} width={30} src="/images/file.png" alt="Admin" />
          <span className="dark:text-white text-gray-700 md:inline font-bold">Admin</span>
        </Link>
      ) : (
        <>
          {links.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 hover:bg-blue-500 hover:text-white rounded"
            >
              <Image height={30} width={30} src={icon} alt={label} />
              <span className="dark:text-white text-gray-700 font-bold">{label}</span>
            </Link>
          ))}
          {isPremium &&
            premiumLinks.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 dark:text-white hover:bg-blue-500 hover:text-white rounded"
              >
                <Image height={30} width={30} src={icon} alt={label} />
                <span className="md:inline dark:text-white font-bold">{label}</span>
              </Link>
            ))}
        </>
      )}
    </div>
  );
};

export default Sidebar;
