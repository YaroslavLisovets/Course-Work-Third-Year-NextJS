import NextAuth from 'next-auth';
import Auth0 from "@node_modules/next-auth/providers/auth0";
import {PrismaClient} from "@prisma/client";


const auth0Options = {
    clientId: process.env.AUTH0_CLIENT_ID, clientSecret:process.env.AUTH0_CLIENT_SECRET,
    issuer: process.env.AUTH0_ISSUER_BASE_URL
};

const handler = NextAuth({
    // @ts-ignore
    providers: [Auth0(auth0Options)], secret: "secret",

    callbacks:{
        async session({ session, trigger, newSession }:any){

            const prisma = new PrismaClient()
            const user = await prisma.user.findFirst({where:{email:{equals:session.user.email}}, include:{roles:true}})
            console.log(session);

            session.user.name = user?.username;

            if (!user?.username.length) {
                session.user.name = user?.email
            }
            session.user.image = user?.icon.length ? user?.icon : "/DefaultIcon.svg";
            session.user.id = user?.id

            session.user.roles = user?.roles.map(role=>{return role.name})


            await prisma.$disconnect();
            return session
        },
    }
})



export {handler as GET, handler as POST}