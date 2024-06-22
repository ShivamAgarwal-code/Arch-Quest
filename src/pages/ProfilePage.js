import {useEffect, useState} from "react";
import PointsLoader from "./components/PointsLoader";
import {useSigningClient} from "../wallet/hooks";
import {getID} from "../api/requests/get";
import {NFT_SVG_LG} from "../api/utils/img";
import {Link} from "react-router-dom";


export default function ProfilePage() {

    const {
        walletAddress,
        signingClient,
        loading,
        error,
        connectWallet,
        disconnect
    } = useSigningClient();

    const [loadingId, setLoadingId] = useState(true)
    const [name, setName] = useState("")
    const [status, setStatus] = useState("")

    useEffect(() => {
        console.log("PROFILE Wallet address:", walletAddress)
        if (walletAddress !== ""){
            getID(walletAddress).then((r) => {
                console.log("PROFILE id:", r)
                setLoadingId(false)
                if (r === "error"){
                    setStatus("Failed to fetch your ID ☹")
                    return
                }
                if (r === null){
                    setStatus("You haven't claimed your Arch-ID yet ☹")
                    return
                }
                setStatus("")
                setName(r)
            })
        }
    }, [walletAddress]);




    return (
        <div className="bg-gradient-to-b from-main-or to-main-orlll min-h-screen">
            <div className="max-w-screen-2xl mx-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div
                        className="font-mono pt-10 flex justify-center text-white font-thin underline text-3xl md:text-5xl">
                        <h1>Profile</h1>
                    </div>

                    <>
                        {walletAddress === "" ? (
                            <p className={"py-16 flex justify-center text-white text-xl md:text-3xl"}>
                                Wallet not connected
                            </p>
                        ) : (
                            <>
                            {loadingId ? (
                                <PointsLoader/>
                                ):(
                                   <>
                                       {name !== "" ? (
                                           <div className="pt-10 xl:pt-20 flex justify-center max-w-full">
                                               <div className="border-white border-4 rounded-lg w-64 md:w-96">
                                                       <Link
                                                           to={'/name/' + name}
                                                           className="">
                                                           <NFT_SVG_LG name={name}/>
                                                       </Link>
                                               </div>
                                           </div>
                                       ):(
                                           <p className={"py-16 flex justify-center text-white text-xl md:text-3xl"}>
                                               {status}
                                           </p>
                                       )}
                                   </>
                                )}
                            </>
                        )}
                    </>
                </div>
            </div>
        </div>

    )


}

