const change_following = async (id: number, user_id: number, to: boolean) => {

    await fetch(`/api/change_following?followed=${id}&following=${user_id}&to=${to}`);

}

// @ts-ignore
import Protocol from "@node_modules/devtools-protocol";
import Image from "next/image";
import useSWR from "swr";
import {useState} from "react";



// @ts-ignore
const UserCard = ({user: {id, username, icon, following}, user_id}) => {
    const [following_, setFollowing_] = useState(following);
    return (
    <div
            className="w-[300px]  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 p-8">
            <div className="flex flex-col items-center">
                <a href={`profile/${id}`}>
                    <Image src={icon} alt={"User Icon"} width={96} height={96}
                           className="w-24 h-24 mb-3 rounded-full shadow-lg"/>
                    <div className="mb-1 text-xl font-medium text-gray-900 dark:text-white capitalize">{username}</div>
                </a>
                <div className="flex items-center w-full space-x-3 mt-3 ">
                    <button onClick={() => {
                        setFollowing_(!following_)
                        change_following(id, user_id, !following_);
                    }}
                            className={`w-full px-4 py-2 text-white ${(following_ ? 'bg-red-500' : 'bg-blue-500')} rounded-full
                         hover:contrast-200 focus:ring-4
                        focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                          dark:focus:ring-blue-800`}>
                        {following_ ? 'Unfollow' : 'Follow'}</button>
                </div>
            </div>
        </div>

    )
}

export default UserCard;