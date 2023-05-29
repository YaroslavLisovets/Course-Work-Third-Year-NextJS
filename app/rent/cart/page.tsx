"use client";
import {useState, useEffect} from "react";
import {useSession} from "@node_modules/next-auth/react";
import Loading from "@components/Loading";
import axios from "@node_modules/axios";


function getNextTwoWeeksDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

function getMaxDate() {
    const today = new Date();
    const maxDate = new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000);
    return maxDate.toISOString().split("T")[0];
}


const EquipmentCard = ({id, name, amount, price, characteristic, setLoading}: any) => {
    let cartAmount = 1;

    const [_amount, setAmount] = useState(amount)
    const handleRemoveFromCart = async () => {
        setLoading(true)

        await axios.post('/api/rent/cart/delete', {item_id: id});
        setLoading(false)
        setAmount(_amount - cartAmount);
    };


    return (
        <div>
            <div
                className="p-3 pt-2 pl-2 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8">
                <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{name}</div>
                <div>Left: {_amount}</div>
                <div>Price per item: {price}₽</div>
                {characteristic && <div className="w-full">Description: {characteristic}</div>}
                <div className="flex items-center w-24">
                    <label htmlFor={`amount-${id}`} className="mr-2 ">
                        Amount: {amount}
                    </label>
                </div>
                <button
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 "
                    onClick={handleRemoveFromCart}
                >
                    Remove from Cart
                </button>

            </div>
        </div>
    );
};


export default () => {
    const {data: session, status} = useSession();
    let user_id = 0;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Array<any>>();


    useEffect(() => {
        if (status == 'loading' || status == 'unauthenticated') {
            return
        }
        //@ts-ignore
        user_id = session?.user?.id
        axios.post('/api/rent/cart', {user_id}).then((response) => {
            setData(response.data)
        });
        //@ts-ignore
        setIsLoading(false)
    }, [session, status]);

    let date: number = 0;
    return (
        <div>
            <Loading isLoading={isLoading}/>
            {!isLoading && (
                <div className={'w-full grid'}>

                    <div className="w-full grid grid-cols-3 gap-4">
                        {/*@ts-ignore*/}
                        {data?.cartItems?.map((value, index) => (
                            <EquipmentCard key={index} id={value.id} price={value.equipment.price * value.amount}
                                           name={value.equipment.name} amount={value.amount}
                                           characteristic={value.characteristic} user_id={user_id}
                                           setLoading={setIsLoading}/>
                        ))}

                    </div>
                    <div className={"justify-self-center bottom-0 fixed  mb-5 space-x-2 flex max-w-[150px]"}>
                        <input
                            type="date"
                            className={"h-10 rounded-lg  w-full flex-none"}
                            min={getNextTwoWeeksDate()} // Set the minimum allowed date
                            max={getMaxDate()} // Set the maximum allowed date
                            onInput={(event) => {
                                /*@ts-ignore*/
                                date = new Date(event.target.value).toISOString();
                            }}
                        />

                        <button
                            className={`w-full flex-none text-center  bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-14 py-2 h-10`}
                            onClick={() => {
                                console.log(date);
                                /*@ts-ignore*/
                                if(date&&data?.id) {
                                    setIsLoading(true)
                                    /*@ts-ignore*/
                                    axios.post('/api/rent/cart/order', {cartId: data?.id, date: date}).then(
                                        () => {setIsLoading(false); setData([])}
                                    )
                                }
                            }}>Order
                        </button>
                    </div>
                </div>
            )
            }
        </div>)
}

