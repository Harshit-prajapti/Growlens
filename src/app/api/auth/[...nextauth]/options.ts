import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "../../../../../models/userModel";
import connectDb from "@/lib/db";
const generateBaseUsername = (fullname: string) => {
  return "@" + fullname.trim().toLowerCase().replace(/\s+/g, "-");
};
const generateUniqueUsername = async (fullname: string) => {
  const base = generateBaseUsername(fullname); // e.g., "@harshit-kumbhkar"
  let username = base;
  let counter = 0;
  while (await UserModel.exists({ username })) {
    counter++;
    username = `${base}${counter}`; // try @harshit-kumbhkar1, @harshit-kumbhkar2, ...
  }

  return username;
};
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // callbacks are called after successfully oauth login
  callbacks: {
    // Called after successful OAuth login
    async signIn({ user }) {
      await connectDb();
      console.log(user);
      const existingUser = await UserModel.findOne({ email: user.email });
      const newUsername = await generateUniqueUsername(user?.name as string);
      if (!existingUser) {
        console.log("I am called");
        console.log({
          email: user.email,
          fullname: user.name,
          username: newUsername,
          avatar: user.image || "",
        });
        try {
          const newUser = await UserModel.create({
            email: user.email,
            fullname: user.name,
            username: newUsername,
            avatar: user.image || "",
            provider: "google",
            role: "user",
            isProfileComplete: false,
          });
          console.log("✅ User created:", newUser);
        } catch (err) {
          console.error("❌ Error creating user:", err);
        }
      }
      return true;
    },
    async jwt({ token }) {
      await connectDb();
      const dbUser = await UserModel.findOne({ email: token.email });
      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.isProfileComplete = dbUser.isProfileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "premium" | "admin";
        session.user.isProfileComplete = token.isProfileComplete as boolean;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};
export default authOptions;
