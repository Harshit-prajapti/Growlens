import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import GitHUbProvider from "next-auth/providers/github";
import twitterProvider from "next-auth/providers/twitter"

export const authOptions : NextAuthOptions = {
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GitHUbProvider({
            clientId : process.env.GITHUB_CLIENT_ID as string,
            clientSecret : process.env.GITHUB_CLIENT_SECRET as string
        }),
    ],
    callbacks : {
        async session({session,token}){
            
        }
    }
}