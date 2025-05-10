import React from "react";
import AuthProvider from "../../../context/AuthProvider";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <AuthProvider>
        <body>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <main className="flex-1 overflow-auto">
              <Navbar/>
              <Sidebar />
              <div className="mt-10 p-4">{children}</div>
            </main>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
