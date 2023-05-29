"use client";
import Image from "next/image";

import {useSession} from "@node_modules/next-auth/react";
import React from "react";
import useSWR from "@node_modules/swr";

const fetchUsers = async (url: string) => {
    const response = await fetch(url);

    return response.json();
}


const Page = ({params}:any) => {

    const {data:user, isLoading} =
        useSWR<{
            username: string,
            icon: string,
            following: number,
            followers: number
        }>(`/api/get_user?u=${params.user_id}`, fetchUsers);


    return (
        <div
            className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
            <div className="px-6">

                <div className="flex flex-wrap justify-center">
                    <div className="w-full flex justify-center">
                        <a href="profile/avatar">
                            <div className="relative group">
                                <Image
                                    src={user?.icon??''}
                                    height={150}
                                    width={150}
                                    className="object-cover object-center shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] group-hover:flex max-h-[150px]"
                                    alt={"get_user profile picture"}/>
                                <div
                                    className="grid place-items-center z-50 fixed  group-hover:opacity-100 opacity-0 rounded-full bg-gray-700 bg-opacity-30  align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-[150px] w-[150px] h-[150px]">
                                    <Image src={"/Edit-Icon.svg"} className={"fill-indigo-300"} alt={"Edit Icon"}
                                           width={25} height={25}/>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="w-full text-center mt-20">
                        <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                            <div className="p-3 text-center">
                                <span
                                    className="text-xl font-bold block uppercase tracking-wide text-slate-700">{user?.followers}</span>
                                <span className="text-sm text-slate-400">Followers</span>
                            </div>

                            <div className="p-3 text-center">
                                <span
                                    className="text-xl font-bold block uppercase tracking-wide text-slate-700">{user?.following}</span>
                                <span className="text-sm text-slate-400">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 capitalize">{user?.username}</h3>
                    {/*<div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">*/}
                    {/*    <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>Paris, France*/}
                    {/*</div>*/}
                </div>
                <div className="mt-6 py-6 border-t border-slate-200 text-center">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full px-4">
                            <p className="font-light leading-relaxed text-slate-600 mb-4">An artist of considerable
                                range,
                                Mike is the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                                and records all of his own music, giving it a warm.</p>
                            {/*<button onClick={()=>{router.prefetch("")}} className="font-normal text-slate-700 hover:text-slate-400">Follow*/}
                            {/*    Account</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Page;