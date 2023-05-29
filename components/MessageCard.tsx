import Image from "@node_modules/next/image";
import {redirect} from 'next/navigation';
import {useRouter} from 'next/router';

// @ts-ignore
export default ({message, curr_user}) => {
    return (
        <div>
            {(message.user.id == curr_user) && <div className="chat-message">

                <div className="flex items-end justify-end mb-14">

                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <span
                            className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message.content}</span>
                    </div>

                    <Image
                        width={6}
                        height={6}
                        src={message.user.icon}
                        alt="My profile" className="w-6 h-6 rounded-full order-2"/>
                </div>

            </div>
            }


            {(message.user.id != curr_user) &&
                <div id="messages"
                     className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                    <div className="chat-message">
                        <div className="flex items-end">
                            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                <div><span
                                    className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message.content}</span>
                                </div>
                            </div>
                            <Image
                                width={6}
                                height={6}
                                src={message.user.icon}
                                alt="My profile" className="w-6 h-6 rounded-full order-2"/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}