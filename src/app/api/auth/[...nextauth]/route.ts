import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {connect} from "@/app/dbConnect/dbConnect"
import User from "@/app/models/userModel"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async session({ session, user, token }){
            
            const sessionUser = await User.findOne({
                email: session.user.email
            })

            session.user.id = sessionUser._id.toString()

            return session

        },

        async signIn({ profile }){
            try{
                await connect();

                //check if the user already exists
                const userExists = await User.findOne({
                    email: profile.email
                })

                //if not, create a new user
                if(!userExists){
                    await User.create({
                        email: profile.email
                      })
                }

                return true;
            }
            catch(error){
                console.log(error)
                return false;
            }
        }
    },

})


//usually we import everything as either GET or POST, but next-auth is an exception
export {handler as GET, handler as POST}