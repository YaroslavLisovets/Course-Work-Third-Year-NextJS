"use client";
import {useSession} from "@node_modules/next-auth/react";
import useSWR from "@node_modules/swr";
import UserCard from "@components/UserCard";
import ChatCard from "@components/ChatCard";
import Link from "next/link";
import {useEffect, useState} from "react";
import Loading from "@components/Loading";

export default () => {
    let query = "";
    const {data: session, status} = useSession();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (session && status == "authenticated") {
            fetch(`/api/get_chats_by_user?u=${session?.user?.id}`).then(
                (response) => {
                    response.json().then((data) => {
                        setData(data);
                        setIsLoading(false);
                    })
                }
            );

        }
    }, [session, status])

    return (
        <div className={" grid content-center"}>
            <div className="flex items-center w-full space-x-3 mt-3">

                <input type="text"
                       className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                       placeholder=" Chat Name" onChange={event => {
                    query = event.target.value
                }}/>
                <button
                    className={` whitespace-nowrap rounded-full border border-black py-1.5 px-5 text-black max-h-[35px] bg-blue-500 hover:bg-blue-900`}
                    onClick={async () => {
                        if (!query.length) {
                            return;
                        }


                        const id = await fetch('/api/new_chat', {
                            method: 'POST', headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({name: query, user: session?.user?.id})
                        })
                    }}
                >Create New Chat
                </button>
            </div>
            <Loading isLoading={isLoading}/>

            {data?.map(chat => (
                <div className={"mt-16 w-full"}><ChatCard chat_id={chat.id} name={chat.name} last_message={chat.last_message}/></div>

            ))}
            {(!data?.length && !isLoading) && (
                <h1 className={"mt-4 text-center"}>
                    No Chat Found
                </h1>)}
        </div>

    )
}