"use client";
import {useState, useEffect} from "react";
import {useSession} from "@node_modules/next-auth/react";
import Loading from "@components/Loading";
import RouteCard from "@components/RouteCard";
import Link from "next/link";

export default function Page() {
    const {data: session, status} = useSession();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (session && status == "authenticated") {
            fetch(`/api/get_routes`).then(
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
        <div>
            {(session?.user?.roles.includes('Manager') &&
                <Link href={"/routes/new"} className={"whitespace-nowrap outline_btn max-h-[35px] mb-3"}>
                    Create New Route
                </Link>)}
            {isLoading && <Loading isLoading={isLoading}/>}
            {(!data?.length && !isLoading) && <div>No Routes</div>}
            {data?.map(route => (
                <RouteCard route={route}/>

            ))}
        </div>
    )
}