import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/app/dbConnect/dbConnect";
import User from "@/app/models/userModel";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.isVefified = token.isVefified;
      }

      return session;
    },

    async signIn({ profile }) {
      try {
        await connect();

        //check if the user already exists
        const userExists = await User.findOne({
          email: profile?.email,
        });

        //if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile?.email,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.isVefified = user.isVefified;
        token.username = user.username;
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
});

//usually we import everything as either GET or POST, but next-auth is an exception
export { handler as GET, handler as POST };
