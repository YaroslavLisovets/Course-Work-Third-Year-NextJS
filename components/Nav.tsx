"use client";

import Link from "next/link";
import Image from "next/image";
import {useState, useEffect} from "react";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";

const Nav = () => {
    const isUserLoggedIn = true;
    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])
    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href={"/"} className='flex gap-2 flex-center'>
                <Image src="icon.svg" alt="" width='30' height='30' className="object-contain scale-150"/>
                <p className="logo_text">Hiking</p>
            </Link>
            <div className="sm:flex hidden">
                {/*<a href="https://www.flaticon.com/free-icons/message" title="message icons">Message icons created by apien - Flaticon</a>*/}
                {isUserLoggedIn ? (<div className='flex gap-3 md:gap-5'>
                        <Link href='/' className='black_btn'>
                            Create Something
                        </Link>
                        <button type={"button"} onClick={signOut} className={"outline_btn"}>Sign out</button>
                        <Link href={'/profile'}>
                            <Image src={'DefaultIcon.svg'} width='37' height='37' alt={'User Profile Icon'}></Image>
                        </Link>
                    </div>) :
                    <>
                        {providers &&
                            Object.values(providers).map((provider) =>
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
                    isUserLoggedIn ? (
                            <div className={'flex'}>
                                <Image src={'DefaultIcon.svg'}
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
                                    Object.values(providers).map((provider) =>
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