"use client";

import {useSession} from "@node_modules/next-auth/react";
import {useEffect, useState} from "react";
import Loading from "@components/Loading";
import MessageCard from "@components/MessageCard";
import Image from "@node_modules/next/image";

export default ({params}: any) => {
    let [show_user_invite, setInvite] = useState(false);
    const WindowOverlay = () => {
        //@ts-ignore
        const UserSearchCard = ({icon, name, id}) => {
            return (
                <div className={'flex w-full h-full items-center'}>
                    <Image width={60}
                           height={60}
                           src={icon} alt={""}/>
                    <div className={"content-center justify-center"}>{name}</div>
                    <button className={'ml-2'} onClick={()=>{
                        fetch(`/api/add_user_to_chat`, {
                            method: 'POST', headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({userId: id, chatId: parseInt(params.chatId)})
                        })
                    }}>Invite</button>
                </div>
            )
        }
        let query = "";
        const [data, setData] = useState(null);
        return (
            <div
                className="flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none bg-white w-[300px] h-[400px]"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="rounded-lg">
                        <input type="text"
                               className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                               placeholder=" Search..."
                               onChange={event => {
                                   query = event.target.value
                               }}
                               onKeyDown={event => {
                                   const search = async () => {
                                       if (!query) {
                                           return;
                                       }
                                       setData(await (await fetch(`/api/search?q=${query}&u=${session?.user?.id}`)).json())
                                   };

                                   if (event.key === 'Enter') {
                                       search()
                                   }
                               }}/>
                        <button onClick={()=>{setInvite(false)}}>Close</button>
                        {data?.map(user => (
                            <UserSearchCard id={user.id} name={user.username} icon={user.icon}/>
                        ))}

                    </div>

                </div>
            </div>);
    };


    let query = "";
    const {data: session, status} = useSession();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const send = () => {
        if (!query) {
            return;
        }
        fetch(`/api/send_message`, {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: session?.user?.id, message: query, chatId: parseInt(params.chatId)})
        }).then(
            (response) => {
                if (session && status == "authenticated") {
                    fetch(`/api/get_messages_by_chat`, {
                        method: 'POST', headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({chatId: parseInt(params.chatId)})
                    }).then(
                        (response) => {
                            response.json().then((data) => {
                                setData(data);
                                setIsLoading(false);
                            })
                        }
                    );

                }
            }
        );

    };

    useEffect(() => {
        if (session && status == "authenticated") {
            fetch(`/api/get_messages_by_chat`, {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({chatId: parseInt(params.chatId)})
            }).then(
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
        <div className={"w-[900px] align-middle "}>
            {show_user_invite && (
                <div className="flex items-center justify-center">
                    <WindowOverlay/>
                </div>)}
            <Loading isLoading={isLoading}/>

            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="flex items-center justify-between space-x-4 w-full">
                    <div className="flex flex-col leading-tight">
                        <div className="text-2xl mt-1 flex items-center">
                            <span className="text-gray-700 mr-3">{data?.chat_data?.name}</span>
                        </div>
                    </div>
                    <button className="ml-auto" onClick={() => {
                        setInvite(true)
                    }}>Invite user
                    </button>
                </div>
            </div>


            {(!data?.messages?.length && !isLoading) && (
                <h1 className={""}>
                    No Users Found
                </h1>)}
            {data && <div className={"mt-4"}>
                {data?.messages?.map(message => (
                    <div><MessageCard message={message} curr_user={session?.user?.id}/></div>

                ))}
                <div className="fixed bottom-0 bg-[#f3f4f6] p-1 w-[900px] flex">
                    <input type="text" className="mr-2 border border-gray-300 rounded-md p-2 w-full"
                           placeholder="Type your message..."
                           onChange={event => {
                               query = event.target.value
                           }}
                           onKeyDown={event => {

                               if (event.key === 'Enter') {
                                   send()
                               }
                           }}
                    />
                    <button
                        className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500
                    ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                        <span className="font-bold" onClick={send}>Send</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="h-6 w-6 ml-2 transform rotate-90">
                            <path
                                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                    </button>
                </div>

            </div>}
        </div>
    )
}