"use client";
import React, {useState, useEffect, useRef, Fragment} from "react";
import {useSession} from "@node_modules/next-auth/react";
import Loading from "@components/Loading";
import RouteCard from "@components/RouteCard";
import Link from "next/link";
import axios from "@node_modules/axios";
import {Dialog, Transition} from "@node_modules/@headlessui/react";
import {Rating} from "@node_modules/@mui/material";
import Image from "@node_modules/next/image";


interface IEquipment {
    id: number;
    name: string;
    price: number;
    characteristic: string;
    amount: number;
}


const EquipmentCard = ({id, name, amount, price, characteristic, user_id, setLoading}:any) => {
    let cartAmount = 1;
    const [_amount, setAmount] = useState(amount)
    const handleAddToCart = async () => {

        // Logic for adding the item to the cart
        const newItem = {
            id: id,
            name: name,
            amount: cartAmount,
            price: price,
            characteristic: characteristic,
            user_id: user_id
        };
        setLoading(true)
        await axios.put('/api/rent/cart', newItem);
        setLoading(false)
        setAmount(_amount-cartAmount);
    };


    return (
        <div>
            <div
                className="p-3 pt-2 pl-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8">
                <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{name}</div>
                <div>Left: {_amount}</div>
                <div>Price: {price}₽</div>
                {characteristic && <div className="w-full">Description: {characteristic}</div>}
                <div className="flex items-center w-24">
                    <label htmlFor={`amount-${id}`} className="mr-2 ">
                        Amount:
                    </label>
                    <input
                        id={`amount-${id}`}
                        type="number"
                        defaultValue={1}
                        min={_amount?1:0}
                        max={_amount}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg"
                        onChange={(e) => {
                            cartAmount = parseInt(e.target.value)
                        }}
                    />
                </div>
                <button
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 "
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>

            </div>
        </div>
    );
};


export default () => {
    const [is_ne_model_visible, setVisibility] = useState(false);
    const [data, setData] = useState<[IEquipment]>();
    const NewEquipmentModel = () => {
        const cancelButtonRef = useRef(null)
        // @ts-ignore
        const validate = (name, price, amount, characteristic) => {
            if (!name || !price || !amount || !characteristic) {
                return false;
            }
            return !(name.length < 1 || price.length < 1 || amount.length < 1 || characteristic.length < 1);
        };

        // @ts-ignore
        const handleInputChange = (event, field) => {
            const value = event.target.value;
            // Update the respective state based on the field name
            if (field === 'name') {
                setName(value);
            } else if (field === 'price') {
                setPrice(value);
            } else if (field === 'amount') {
                setAmount(value);
            } else if (field === 'characteristic') {
                setCharacteristic(value);
            }

            // Validate the inputs
            const isValid = validate(name, price, amount, characteristic);
            setCanInput(isValid);
        };
        let [name, setName] = useState('')
        let [price, setPrice] = useState('')
        let [amount, setAmount] = useState('')
        let [characteristic, setCharacteristic] = useState('')
        let [can_input, setCanInput] = useState(false)
        return (<Transition.Root show={is_ne_model_visible} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setVisibility}>
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
                                                Add New Equipment
                                            </Dialog.Title>

                                            <div className={`mt-2 space-y-3`}>
                                                <input
                                                    type="text"
                                                    className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                                                    placeholder="Name..."
                                                    onChange={(event) => handleInputChange(event, 'name')}
                                                />

                                                <input
                                                    type="number"
                                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                                                    placeholder="Price..."
                                                    onChange={(event) => handleInputChange(event, 'price')}
                                                />

                                                <input
                                                    type="number"
                                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                                                    placeholder="Amount..."
                                                    onChange={(event) => handleInputChange(event, 'amount')}
                                                />

                                                <input
                                                    type="text"
                                                    className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                                                    placeholder="Characteristic..."
                                                    onChange={(event) => handleInputChange(event, 'characteristic')}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className={`inline-flex w-full justify-center rounded-md ${can_input ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'text-gray-900 ring-gray-300 hover:bg-gray-5 bg-white'}
                                             px-3 py-2 text-sm font-semibold  shadow-sm  sm:ml-3 sm:w-auto`}
                                        onClick={() => {
                                            axios.put('/api/rent/', {
                                                name: name,
                                                price: parseInt(price),
                                                amount: parseInt(amount),
                                                characteristic: characteristic
                                            }).then((r) => {
                                                data?.push(r.data)
                                                setData(data)
                                            })
                                            setVisibility(false)


                                        }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setVisibility(false)}
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
    const {data: session, status} = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<Array<string>>();

    const [orders, setOrders] = useState<Array<any>>()

    useEffect(() => {
        if (status == 'loading' || status == 'unauthenticated') {
            return
        }

        //@ts-ignore
        setRole(session?.user?.roles)
        //@ts-ignore
        if(session?.user?.roles?.includes('storage')){
            console.log("storage")
            axios.get('/api/rent/orders').then((response)=>{
                setOrders(response.data)

            })
        }
        axios.get('/api/rent').then((response) => {
            setData(response.data)
        });

        setIsLoading(false)
    }, [session, status]);


    return (
        <div>
            <Link href={"/rent/cart"} className="whitespace-nowrap outline_btn max-h-[35px] mb-3 fixed left-0 bottom-0 inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <Image src={'/cart.svg'} alt={'cart image'} height={20} width={20}/>
            </Link>
            <Loading isLoading={isLoading}/>
            <NewEquipmentModel/>
            {(role?.includes('storage')) && (
                <div>
                    <button className={"whitespace-nowrap outline_btn max-h-[35px] mb-3"} onClick={() => {
                        setVisibility(true)
                    }}>
                        Add New Equipment
                    </button>
                    {orders?.map((order, index) => {
                        let query = '';
                        const returnDate = new Date(order.return_date);
                        const currentDate = new Date();

                        const timeDiff = returnDate.getTime() - currentDate.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        const isExpired = daysLeft < 0;

                        return (
                            <div key={index}>
                                <div
                                    className="w-[350px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 p-8">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`mb-1 text-xl font-medium ${isExpired ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                            {isExpired ? 'Expired' : `${daysLeft} day(s) left`}
                                        </div>
                                    </div>
                                    <input type="text"
                                           className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px] w-full"
                                           placeholder=" Claims ..."
                                           onChange={event => {
                                               query = event.target.value
                                           }}/>
                                    <button onClick={() => {
                                        setIsLoading(true)
                                        axios.put('/api/rent/orders', {orderId:order.id, claims:query}).then(()=>{

                                            setOrders(orders?.slice(index, 1))
                                            setIsLoading(false)
                                        })
                                    }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                                        Check Order
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            )}
            {!isLoading && (
                <div className="w-full grid grid-cols-3 gap-4">
                    {data?.map((value, index) => (
                        <EquipmentCard key = {index} id={value.id} price={value.price} name={value.name} amount={value.amount}
                                       characteristic={value.characteristic} user_id={session?.user?.id} setLoading={setIsLoading}/>
                    ))}

                </div>
            )
            }
            <button className={"bottom-0 right-0 fixed rounded bg-blue-500 hover:bg-blue-700 text-white"} onClick={()=>{print()}}> Print Equipment </button>
        </div>
    )
}