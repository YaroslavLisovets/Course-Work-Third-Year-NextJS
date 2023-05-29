"use client";
import Image from "next/image";

import {useSession} from "@node_modules/next-auth/react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation"
import useSWR from "@node_modules/swr";
import axios from "@node_modules/axios";
import {jsPDF, HTMLOptionImage} from "jspdf";
import {Document, Text, View, StyleSheet} from '@react-pdf/renderer';


type props = {

    html?: React.MutableRefObject<HTMLDivElement>;

};

const handlePrint = (order: any) => {
    const generatePdf = () => {
        const doc = new jsPDF();
        // Add content to the PDF
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        doc.text(`Order ID: ${order.id}`, 10, 20);
        // @ts-ignore
        doc.text(`Borrow Date: ${new Date(order.borrow_date).toLocaleString('en', options)}`, 10, 30);
        // @ts-ignore
        doc.text(`Return Date: ${new Date(order.return_date).toLocaleString('en', options)}`, 10, 40);

        doc.text('Ordered Equipment:', 10, 60);
        let yPos = 70;
        let total_price = 0;
        order.OrderedEquipment.forEach((item: any) => {
            const {name, price, characteristic, amount} = item.equipment;
            // doc.text(`Equipment ID: ${id}`, 20, yPos);
            doc.text(`Name: ${name}`, 30, yPos + 10);
            doc.text(`Price: ${price}`, 30, yPos + 20);
            doc.text(`Characteristic: ${characteristic}`, 30, yPos + 30);
            doc.text(`Amount: ${amount}`, 30, yPos + 40);
            doc.text(`Total Price: ${amount * price}`, 30, yPos + 50);
            total_price += amount * price;
            yPos += 60;
        });
        const borrowDate = new Date(order.borrow_date);
        const returnDate = new Date(order.return_date);
        let timeDiff = returnDate.getTime() - borrowDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (order.checked) {
            doc.text(`Total price: ${total_price * days}`, 10, yPos + 20)
            yPos += 30
        }
        const currentDate = order.checked ? returnDate : new Date();

        timeDiff = returnDate.getTime() - currentDate.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const isExpired = daysLeft < 0;

        if ((!order.checked) && isExpired) {
            doc.text(`+ Fee: ${10 * (-daysLeft)}`, 10, yPos + 20)
            doc.text(`Delay: ${-daysLeft} days`, 10, yPos + 30)
            yPos += 40;
        }


        doc.save('order.pdf');

    };

    generatePdf();
};

const Page = () => {

    const {data: session, status} = useSession();
    let user_id = 0;


    const {data: user} =
        useSWR<{
            username: string,
            icon: string,
            following: number,
            followers: number
        }>
            //@ts-ignore
            (`/api/get_user?u=${session?.user?.id}`, async (url: string) => {
                return (await fetch(url)).json()
            });
    const [orders, setOrders] = useState<Array<any>>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (session && status == "authenticated") {
            // @ts-ignore
            user_id = session?.user?.id;
            //@ts-ignore
            axios.post('/api/rent/orders', {userId: user_id}).then(
                value => {
                    // @ts-ignore
                    setOrders(value.data)
                }
            )

        }
    }, [session, status])
    return (
        <div
            className="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
            <div className="px-6">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full flex justify-center">
                        <a href="profile/avatar">
                            <div className="relative group">
                                <Image
                                    src={session?.user?.image ?? ''}
                                    height={150}
                                    width={150}
                                    className="object-cover shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] group-hover:flex max-h-[150px]"
                                    alt="get_user profile picture"
                                />
                                <div className="relative group">
                                    <div
                                        className="grid place-items-center z-50 absolute top-0 left-0 opacity-0 rounded-full bg-gray-700 bg-opacity-30 align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-[150px] w-[150px] h-[150px] group-hover:opacity-100">
                                        <Image src="/Edit-Icon.svg" className="fill-indigo-300" alt="Edit Icon"
                                               width={25} height={25}/>
                                    </div>
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
                    <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 capitalize">{session?.user?.name}</h3>
                </div>
                <div className="mt-6 py-6 border-t border-slate-200 text-center">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full px-4">
                            <p className="font-light leading-relaxed text-slate-600 mb-4">An artist of considerable
                                range,
                                Mike is the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                                and records all of his own music, giving it a warm.</p>
                        </div>
                    </div>
                </div>
                <div className={"w-full"}>
                    <div className={"text-xl font-bold justify-self-center text-center"}>Orders</div>

                    {orders?.map((order, index) => {
                        const returnDate = new Date(order.return_date);
                        const currentDate = new Date();

                        const timeDiff = returnDate.getTime() - currentDate.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        const isExpired = daysLeft < 0;

                        return (
                            <div key={index}>
                                <div>
                                </div>
                                <div
                                    className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 p-8">
                                    <div className="flex flex-col items-center">
                                        {(!order.checked)?(<div
                                            className={`mb-1 text-xl font-medium ${isExpired ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                            {isExpired ? 'Expired' : `${daysLeft} day(s) left`}
                                        </div>):(<div className={"mb-1 text-xl font-medium text-gray-900 dark:text-white"}>Returned</div>)}
                                        {/* Add your other content here */}
                                    </div>
                                    <button onClick={() => {
                                        handlePrint(order)
                                    }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
                                        Print
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
            <button className={"bottom-0 right-0 fixed rounded bg-blue-500 hover:bg-blue-700 text-white"} onClick={()=>{print()}}> Print profile </button>
        </div>


    );
};

export default Page;