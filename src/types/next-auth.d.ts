import "next-auth"
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User{
        _id?: string;
        username?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: string;
        isVefified?: boolean;
    }

    interface Session{
        user: {
            _id?: string,
            username?: string,
            name?: string,
            email?: string,
            image?: string,
            role?: string,
            isVefified?: boolean,
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string,
        username?: string,
        name?: string,
        email?: string,
        image?: string,
        role?: string,
        isVefified?: boolean,
    }
}