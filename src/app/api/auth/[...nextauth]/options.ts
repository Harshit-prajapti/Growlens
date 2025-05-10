import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import UserModel from "../../../../../models/userModel";
import connectDb from "@/lib/db";
export const authOptions : NextAuthOptions = {
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],
    session : {
        strategy : "jwt"
    },
    // callbacks are called after successfully oauth login
    callbacks : {
       // Called after successful OAuth login
    async signIn({ user}) {
        await connectDb();
        const existingUser = await UserModel.findOne({ email: user.email });
  
        if (!existingUser) {
          // First time login → create a basic user entry
          await UserModel.create({
            email: user.email,
            name: user.name,
            avatar: user.image,
            role: "user", // default role
            isProfileComplete: false,
          });
        }
        return true;
      },
      async jwt({token}){
        await connectDb()
        const dbUser = await UserModel.findOne({email : token.email})
        if(dbUser){
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.isProfileComplete = dbUser.isProfileComplete
        }
        return token
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as "user" | "premium" | "admin";
          session.user.isProfileComplete = token.isProfileComplete as boolean;
        }
        return session;
      },
      async redirect({baseUrl}){
        return baseUrl
      },
    },
    // pages : {
    //     signIn : "/login",
    //     signOut : "/logout"
    // }
}
export default authOptions