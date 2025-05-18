
import connectDb from "@/lib/db";
import { getServerSession } from "next-auth";
import SignIn from "./Components/SignIn/page";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session){
    redirect("/dashboard")
    console.log("Session is available")
  }
  connectDb();
  return (
    <>
       <section className="bg-gradient-to-br from-indigo-50 to-white py-16 px-6 sm:px-12 lg:px-24 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Supercharge Your Business with <span className="text-indigo-600">AI-Driven Analytics</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-10">
          Welcome to Grouth Lance — the platform where data meets intelligence. Predict market trends,
          understand your customers, and grow smarter with every decision.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left mb-12">
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">📊 Sales Insights</h3>
            <p className="text-gray-600">Track revenue, profit, and quantity sold for every product — all in real-time.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">🧠 AI Predictions</h3>
            <p className="text-gray-600">Get smart suggestions and future sales predictions powered by machine learning.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">📈 Graphical Reports</h3>
            <p className="text-gray-600">Visualize business performance over days, weeks, and months in clean charts.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">⚡ Real-Time Dashboard</h3>
            <p className="text-gray-600">Live updates and metrics for instant decision-making at your fingertips.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">🔒 Secure & Scalable</h3>
            <p className="text-gray-600">Built with modern tech, ready to scale with your growing business securely.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">💬 Personalized Support</h3>
            <p className="text-gray-600">We’re with you every step — helping you understand your data and make it work for you.</p>
          </div>
        </div>
        <SignIn/>
        <footer className="mt-16 text-sm text-gray-500">
          <p>Created by Harshit Kumbhkar</p>
          <p className="mt-1">
            📱 +91 9039140984 &nbsp; | &nbsp;
            📸 <a href="https://instagram.com/mr.harshprajapti" target="_blank" className="text-indigo-600 hover:underline">Instagram</a>
          </p>
        </footer>
      </div>
    </section>
    </>
  );
}
