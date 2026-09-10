import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        // Always use the first name from Google
        const firstName = user.name ? user.name.split(" ")[0] : email.split("@")[0];

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              username: firstName,
              email,
              image: user.image,
            },
          });
        } else if (existingUser.username !== firstName || existingUser.image !== user.image) {
          // Update the username and image if they changed
          existingUser = await prisma.user.update({
            where: { email },
            data: {
              username: firstName,
              image: user.image,
            }
          });
        }
        
        user.id = existingUser.id;
        user.name = existingUser.username;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
