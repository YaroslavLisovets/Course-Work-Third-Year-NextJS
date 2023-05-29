"use client";
import React, {useState, useEffect, Fragment, useRef} from 'react';
import axios from 'axios';
import Link from "@node_modules/next/link";
import {useSession} from "@node_modules/next-auth/react";
import Loading from "@components/Loading";
import {Dialog, Transition} from '@headlessui/react'
import {Rating} from "@mui/material";



const RestPoint = ({name, description, capacity}: { name: string, description: string, capacity: string }) => {
    return (
        <div
            className="p-3 pt-2 pl-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8">
            <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{name}</div>
            <div>Capacity: {capacity}</div>
            {description && <div className={"w-full"}>Description: {description}</div>}


        </div>
    )
}

export default function Page({params}: any) {
    const [isRateOpen, setRateWindow] = useState(false)
    const WindowOverlay = ({route_id, user_id, row_id}: any) => {

        const cancelButtonRef = useRef(null)
        const [rate, setRating] = useState(0);
        return (<Transition.Root show={isRateOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setRateWindow}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div
                                            className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">

                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="text-base font-semibold leading-6 text-gray-900">
                                                Finish Route
                                            </Dialog.Title>
                                            <Rating
                                                value={rate}
                                                precision={0.5}
                                                max={5}
                                                onChange = {(event, value)=>{setRating(value||rate); return value }}
                                            />
                                            <div className={`mt-2 `}>
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to finish the route?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className={`inline-flex w-full justify-center rounded-md ${rate ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'text-gray-900 ring-gray-300 hover:bg-gray-5 bg-white'}
                                             px-3 py-2 text-sm font-semibold  shadow-sm  sm:ml-3 sm:w-auto`}
                                        onClick={() => {
                                            if (rate) {
                                                axios.put('/api/routes/update_finished', {
                                                    //@ts-ignore
                                                    user_id: parseInt(user_id),
                                                    route_id: parseInt(route_id),
                                                    rate: rate,
                                                    row_id: parseInt(row_id)

                                                }).then()
                                                setRateWindow(false)
                                                setOnGoing({route_id: 0, id: 0});
                                            }
                                        }}
                                    >
                                        Finish
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setRateWindow(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>)
    }

    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [restPoints, setRestPoints] = useState([]);
    const [rate, setRate] = useState([]);
    const {data: session, status} = useSession();
    const [on_going_route, setOnGoing] = useState({route_id: 0, id: 0});
    const [isLoading, setLoading] = useState(true)
    const [review_amount, setReviews] = useState(0);


    useEffect(() => {
        // Fetch existing route data based on params.routeId

        const fetchRouteData = async () => {
            try {
                const response = axios.get(`/api/routes/${params.routeId}`);
                const routeData = (await response).data;
                setName(routeData.name);
                setDifficulty(routeData.difficulty);
                setRestPoints(routeData.rest_points);
                setRate(routeData.rate);
                setLoading(false)
                setReviews(routeData.amount_rates)
            } catch (error) {
                console.error('Error fetching route data:', error);
            }
        };
        if (params.routeId) {
            fetchRouteData().then();
        }
    }, [params.routeId]);

    useEffect(() => {
        if (status == 'loading' || status == 'unauthenticated') {
            return
        }
        //@ts-ignore
        axios.post('/api/routes/on_going_route', {user_id: session?.user?.id}).then((response) => {
            setOnGoing(response.data);
        });
    }, [session, status]);


    return (
        <div>
            {isLoading ? <Loading isLoading={isLoading}/> :

                <div>
                    {isRateOpen && (
                        <div className="flex items-center justify-center">
                            {/*@ts-ignore*/}
                            <WindowOverlay route_id={params.routeId} user_id={session?.user?.id} row_id={on_going_route.id}/>
                        </div>)}
                    <div>
                        {/*@ts-ignore*/}
                        {(session?.user?.roles?.includes('Manager') &&
                            <Link href={`/routes/edit/${params.routeId}`}
                                  className={"max-w-[100px] whitespace-nowrap outline_btn max-h-[35px] mb-3"}>
                                Edit Route
                            </Link>)}
                    </div>
                    <div className={"w-[900px] align-middle "}>
                        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                            <div className="flex items-center justify-between space-x-4 w-full">
                                <div className="flex flex-col leading-tight">
                                    <div className="text-2xl mt-1 flex items-center">
                                        <span className="text-gray-700 mr-3">{name}</span>
                                    </div>
                                </div>
                                <button
                                    className={`ml-auto rounded-full border text-white py-1.5 px-5 transition-all hover:bg-white hover:text-black text-center text-sm font-inter flex items-center justify-center ${on_going_route?.route_id ? (on_going_route?.route_id == params.routeId ? 'bg-red-500' : 'bg-gray-500') : 'bg-blue-500'} `}
                                    onClick={() => {
                                        if (!on_going_route?.route_id) {
                                            axios.put('/api/routes/update_finished', {
                                                //@ts-ignore
                                                user_id: session?.user?.id,
                                                route_id: parseInt(params.routeId)

                                            }).then((r)=>{setOnGoing(r.data);})

                                        } else if (on_going_route?.route_id == params.routeId) {
                                            setRateWindow(true);

                                        }
                                    }}>
                                    <div
                                        className={"capitalize"}>{on_going_route?.route_id ? (on_going_route?.route_id == params.routeId ? 'finish route' : 'another route is going') : 'start route'}</div>
                                    {

                                    }
                                </button>
                            </div>
                        </div>
                        <div className={"text-xl"}>
                            Difficulty: {difficulty}/10.
                        </div>
                        {0 < review_amount && (<div className="flex items-center">
                            <svg aria-hidden="true" className="w-10 h-10 text-yellow-400" fill="currentColor"
                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title>
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">{rate || 5}</p>
                            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                            <a href="#"
                               className={`text-sm font-medium text-gray-900 hover:no-underline dark:text-white`}>{review_amount} {/*underline*/}
                                reviews</a>
                        </div>)}
                        {!review_amount && <div>No reviews</div>}

                        <div className={"text-2xl mt-4 mb-4"}>Rest Points:</div>
                        {
                            restPoints?.map((rest_point) => (
                                //@ts-ignore
                                <RestPoint name={rest_point.name} capacity={rest_point.capacity}
                                    //@ts-ignore
                                           description={rest_point.description}/>
                            ))
                        }

                    </div>
                </div>}
            <button className={"bottom-0 right-0 fixed rounded bg-blue-500 hover:bg-blue-700 text-white"} onClick={()=>{print()}}> Print Route </button>
        </div>
    )
}