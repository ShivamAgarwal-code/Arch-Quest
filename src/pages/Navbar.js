import logo from "../resources/logo_white.png";
import {Link} from "react-router-dom";
import {MAINTENANCE} from "../api/config";
import {useEffect, useState} from "react";
import {useSigningClient} from "../wallet/hooks";
import {WhiteButtonWithBorder} from "./components/WhiteButtonWithBorder";

export default function Navbar() {

    const {
        walletAddress,
        signingClient,
        loading,
        error,
        connectWallet,
        disconnect
    } = useSigningClient();

    useEffect(() => {
        console.log("NAVBAR Wallet address:", walletAddress)

    }, [walletAddress]);



    return (
        <div>
            {MAINTENANCE ? (<div className="text-center px-2 bg-white flex justify-center text-yellow-500 text-xs sm:text-sm md:text-base">
                Maintance
            </div>) : <></>}
            <nav className="bg-main-or px-2 sm:px-4 py-2.5 text-white">
                <div className="container flex flex-wrap justify-between items-center mx-auto">
                   <Link to={'/'} className="flex items-center">
                        <img src={logo} className="mr-3 h-6 sm:h-9" alt="ArchID"/>
                        <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap">Questarch</span>
                    </Link>
                    <div className="w-auto" id="navbar-default">
                        <ul className="flex mt-4 space-x-8 mt-0 text-white md:text-xl text-base">
                            {walletAddress !== "" ? (
                                <li>
                                    <Link to={'/profile'}
                                          className="block py-2 pr-4 pl-3 hover:underline"
                                          aria-current="page">Profile
                                    </Link>
                                </li>

                            ) : (
                                <li>
                                    <button
                                        onClick={connectWallet}
                                        className="block py-2 pr-4 pl-3 hover:underline"
                                        aria-current="page"
                                    >Connect Wallet </button>
                                </li>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    )
}