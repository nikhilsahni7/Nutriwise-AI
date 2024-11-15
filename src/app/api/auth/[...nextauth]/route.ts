import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/app/dbConnect/dbConnect";
import User from "@/app/models/userModel";

interface ExtendedProfile extends Record<string, any> {
  picture?: string;
}

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

    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: ExtendedProfile;
    }) {
      try {
        await connect();

        // Log the entire profile to debug
        console.log("Profile:", profile);

        // Check if the user already exists
        const userExists = await User.findOne({
          email: profile?.email,
        });

        // If not, create a new user
        if (!userExists) {
          await User.create({
            email: profile?.email,
            image: profile?.picture,
            name: profile?.name,
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

// Usually we import everything as either GET or POST, but next-auth is an exception
export { handler as GET, handler as POST };
