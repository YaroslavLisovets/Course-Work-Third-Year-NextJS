import Image from "@node_modules/next/image";
import {redirect} from 'next/navigation';
import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import {useSession} from "@node_modules/next-auth/react";

// @ts-ignore
export default ({chat_id, last_message, name}) => {



    return (

        <a href={`/chats/${chat_id}`}>
            <div
                    className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 p-8">
                <div className="flex flex-col items-center">
                    <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Chat Name: {name}</div>
                    {last_message?.length &&
                        <div className="text-gray-500 dark:text-gray-300">Last Message: {last_message}</div>}
                </div>
            </div>
        </a>
    )
}