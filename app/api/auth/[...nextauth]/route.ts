import NextAuth from 'next-auth';
import {SupabaseAdapter} from "@node_modules/@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    }),
    providers:[
        GoogleProvider({clientId:'',clientSecret:''})
    ],
    async session({session}){

    },
    async signIn({profile}){

    }
})

export {handler as GET, handler as POST}