/** app/api/uploadthing/core.ts */
import {createUploadthing, type FileRouter} from "uploadthing/next";
import {getToken} from "@node_modules/next-auth/jwt";
import {PrismaClient} from "@prisma/client";

const f = createUploadthing();

const auth = (req: Request) => {
    // console.log(req);
    return {id: "fakeId"};
}; // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f
        // Set permissions and file types for this FileRoute
        .fileTypes(["image"])
        .maxSize("4MB")
        .middleware(async (req) => {
            // This code runs on your server before upload
            const token = await getToken({req, secret: "secret"})

            // If you throw, the get_user will not be able to upload

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return {userEmail: token?.email as string};
        })
        .onUploadComplete(async ({metadata, file}) => {
            const prisma = new PrismaClient()
            await prisma.user.update({where:{email:metadata.userEmail}, data:{icon:file.url}})

        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;