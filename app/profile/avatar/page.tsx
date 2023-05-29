"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "@uploadthing/react";
import {OurFileRouter} from "@app/api/uploadthing/core";
import {useSession} from "next-auth/react";
import {signOut} from "@node_modules/next-auth/react";


export default function Home() {
    const { data: session, update} = useSession();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <UploadButton<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    // @ts-ignore
                    update({image:res[0].fileUrl}).then()

                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.

                }}
            />
        </main>
    );
}