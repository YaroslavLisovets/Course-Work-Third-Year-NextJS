"use client";

import Link from "next/link";
import Image from "next/image";
import {useState, useEffect} from "react";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";
import {useRouter} from "next/navigation"


const Nav = () => {
    let query = "";
    const router = useRouter()
    const {data: session} = useSession();

    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            // @ts-ignore
            setProviders(response);
        }
        setUpProviders()
    }, [])
    // @ts-ignore
    // @ts-ignore
    return (
        <nav className="flex-between w-full mb-16 pt-3 pb-16">
            <Link href={"/"} className='flex gap-2 flex-center'>
                <Image src="/icon.svg" alt="" width='30' height='30' className="object-contain scale-150"/>
                <p className="logo_text">Hiking</p>
            </Link>
            <div className="sm:flex hidden">
                {/*<a href="https://www.flaticon.com/free-icons/message" title="message icons">Message icons created by apien - Flaticon</a>*/}
                {session ? <div className='flex gap-3 md:gap-5 flex-center'>

                        <div className="rounded-lg">
                            <input type="text"
                                   className="whitespace-nowrap rounded-full border border-black bg-transparent py-1.5 px-5 text-black max-h-[35px]"
                                   placeholder=" Search..."
                                   onChange={event => {
                                       query = event.target.value
                                   }}
                                   onKeyDown={event => {
                                       const search = () => {
                                           if (!query) {
                                               return;
                                           }
                                           const encodedSearchQuery = encodeURI(query)
                                           router.push(`/search?q=${encodedSearchQuery}`)
                                       };

                                       if (event.key === 'Enter') {
                                           search()
                                       }
                                   }}/>
                        </div>
                        <Link href={'/chats'}>
                            <Image alt={'chat Image'} src={'/chat.svg'} width={35} height={35}></Image>
                        </Link>
                        <Link href={'/routes'}>
                            <Image alt={'chat Image'} src={'/route.svg'} width={35} height={35}></Image>
                        </Link>
                        <Link href={'/rent'} className='whitespace-nowrap black_btn max-h-[35px]'>
                            Rent
                        </Link>

                        <button type={"button"} onClick={() => signOut()}
                                className={"whitespace-nowrap outline_btn max-h-[35px]"}>Sign out
                        </button>
                        <Link href={'/profile'} className={'flex-center'}>
                            <Image src={session.user?.image ?? ""} width='50' height='50' alt={'User Profile Icon'}
                                   className={"rounded-full"}></Image>
                            <div className="text-3xl capitalize whitespace-nowrap">
                                {session.user?.name}
                            </div>
                        </Link>
                        


                    </div> :
                    <>
                        {providers &&
                            Object.values(providers).map((provider: any) =>
                                <button type={'button'}
                                        key={provider.name}
                                        onClick={() => signIn(provider.id)}
                                        className={'black_btn'}>
                                    Sign In
                                </button>
                            )
                        }
                    </>
                }
            </div>

            <div className="sm:hidden flex relative">
                {
                    session ? (
                            <div className={'flex'}>
                                <Image src={session.user?.image ?? ""}
                                       width='37'
                                       height='37'
                                       alt={'User Profile Icon'}
                                       onClick={() => {
                                           setToggleDropdown((prevState) => !prevState)
                                       }
                                       }/>
                                {toggleDropdown && (
                                    <div className={'dropdown'}>
                                        <Link href={'/profile'}
                                              className={'dropdown_link'}
                                              onClick={() => setToggleDropdown(false)}>
                                            My Profile
                                        </Link>

                                        <button type={"button"} className={'mt-5 w-full black_btn'}
                                                onClick={() => {
                                                    setToggleDropdown(false);
                                                    signOut();
                                                }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>)}
                            </div>
                        ) :
                        (
                            <>
                                {providers &&
                                    Object.values(providers).map((provider: any) =>
                                        <button type={'button'}
                                                key={provider.name}
                                                onClick={() => signIn(provider.id)}
                                                className={'black_btn'}>
                                            Sign In
                                        </button>
                                    )
                                }
                            </>
                        )
                }
            </div>
        </nav>

    );
};

export default Nav;