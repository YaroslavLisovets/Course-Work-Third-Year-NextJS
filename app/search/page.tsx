"use client";

import {useSearchParams} from "next/navigation";
import {User} from "@prisma/client"
import useSWR from "swr";
import Protocol from "@node_modules/devtools-protocol";
import integer = Protocol.integer;
import UserCard from "@components/UserCard"
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

const fetchUsers = async (url: string) => {
    const response = await fetch(url);

    return response.json();
}


const SearchPage = () => {
    const {data: session, status} = useSession();
    const search = encodeURI(useSearchParams()?.get('q') || '');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (session && status == "authenticated") {
            //@ts-ignore
            fetch(`/api/search?q=${search}&u=${session?.user?.id}`).then(
                (response) => {
                    response.json().then((data) => {
                        setData(data);
                        setIsLoading(false);
                    })
                }
            );

        }
    }, [session, status])
    // @ts-ignore
    // const {data, isLoading} =
    //     useSWR<Array<{
    //         id: integer,
    //         username: string,
    //         icon: string,
    //         _following: boolean
    //     }>>(`/api/search?q=${search}&u=${session?.user?.id}`, fetchUsers);

    return (
        <div>
            {isLoading && (
                <div className=" flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>)}
            {/*@ts-ignore*/}
            {data?.map(user => (

                <div><UserCard user={user}
                               user_id={
                                   //@ts-ignore
                                   session?.user?.id}/></div>

            ))}
            {/*@ts-ignore*/}
            {(!data?.length && !isLoading) && (
                <h1 className={""}>
                    No Users Found
                </h1>)}
        </div>
    )
}


export default SearchPage;