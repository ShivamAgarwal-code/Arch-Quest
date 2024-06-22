import {useEffect, useState} from "react";
import PointsLoader from "./components/PointsLoader";
import {useSigningClient} from "../wallet/hooks";
import {getAllQuests, getID, getName} from "../api/requests/get";
import {NFT_SVG_LG} from "../api/utils/img";
import {useParams} from "react-router";
import {WhiteButtonWithBorder} from "./components/WhiteButtonWithBorder";
import {createQuest, registerName, updateAllowlist, updateStatus} from "../api/requests/set";
import {CustomAlert} from "./components/Alert";
import InputPriceModalSt from "./components/Modal";
import InputPriceModalQ from "./components/ModalQ";
import InputPriceModalA from "./components/ModalA";


export default function ProfilePage() {

    const {
        walletAddress,
        signingClient,
        loading,
        error,
        connectWallet,
        disconnect,
        gasPrice
    } = useSigningClient();

    let {currentName} = useParams()
    currentName = currentName.toLowerCase()

    let [loadingId, setLoadingId] = useState(true)
    let [ownerAddress, setOwnerAddress] = useState("")
    let [isDao, setIsDao] = useState(false)
    let [description, setDescription] = useState("")
    let [completedQuests, setCompletedQuests] = useState([])

    const [visibleSt, setVisibleSt] = useState(false)
    const [visibleA, setVisibleA] = useState(false)
    const [visibleQ, setVisibleQ] = useState(false)

    const handleChange = (e) => {
        const value = e.target.value
        console.log()
        let valueUpd = value;
        if (valueUpd.length > 100) {
            valueUpd = valueUpd.substr(0, 100)
        }
        setDescription(valueUpd);
    };

    const [isAlert, setIsAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState([true, ''])

    function showAlert(msg, isErr) {
        console.log(msg)
        setAlertMsg([isErr, msg])
        setIsAlert(true)
        setTimeout(function () {
            setIsAlert(false)
        }, 5000);
    }

    const register = () => {
        if (walletAddress === "") {
            showAlert("Error: Please connect wallet", true)
            return
        }
        setLoadingId(true)
        getID(walletAddress).then((r) => {
            if (r === "error" || r === null) {
                registerName(walletAddress, signingClient, gasPrice, currentName, description, isDao).then((r) => {
                    setLoadingId(false)
                    if (r === true) {
                        showAlert("Success", false)
                        setOwnerAddress(walletAddress)
                    } else {
                        if (r.startsWith("Error: Account does not exist on chain.")) {
                            showAlert("Error: No funds", true)
                            return
                        }
                        showAlert("Error", true)
                    }
                })
            } else {
                setLoadingId(false)
                showAlert("Error: You already have ID", true)
            }
        })
    }


    const updateStatusOnchain = (newStatus) => {
        setLoadingId(true)
        updateStatus(walletAddress, signingClient, gasPrice, currentName, newStatus).then((r) => {
            if (r === true) {
                setDescription(newStatus)
                setVisibleSt(false)
            }
            setLoadingId(false)
        })
    }

    const createQuestClick = (questName, questDes) => {
        setLoadingId(true)
        createQuest(walletAddress, signingClient, gasPrice, currentName, questName, questDes).then((r) => {
            if (r === true) {
                let newQuests = JSON.parse(JSON.stringify(completedQuests))
                newQuests.push({
                    name: questName,
                    description: questDes,
                    id: currentName + "-" + (newQuests.length + 1).toString()
                })
                setCompletedQuests(newQuests)
                setVisibleQ(false)
            }
            setLoadingId(false)
        })
    }


    const updateAllowlistClick = (questId, addId) => {
        setLoadingId(true)
        updateAllowlist(walletAddress, signingClient, gasPrice, currentName, questId, addId).then((r) => {
            if (r === true) {
                setVisibleA(false)
            }
            setLoadingId(false)
        })
    }

    useEffect(() => {
        console.log("ELEMENT Wallet address:", walletAddress)
        if (!currentName) {
            return
        }
        console.log("NAME", currentName)

        getName(currentName).then((r) => {
            console.log("GET:", r)
            if (r === "error") {
                return
            }
            if (r === null) {
                setLoadingId(false)
                console.log("No owner")
                return
            }
            setOwnerAddress(r.owner)
            if (r.description === ""){
                setDescription("-")
            } else {
                setDescription(r.description)
            }
            setIsDao(r.is_dao)
            getAllQuests(r.quests).then(names => {
                setCompletedQuests(names)
            }).catch()
            setLoadingId(false)
        })

    }, [currentName, walletAddress]);


    return (
        <div className="bg-gradient-to-b from-main-or to-main-orlll min-h-screen">
            <div className="max-w-screen-2xl mx-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {isAlert ? (
                        <div className="absolute top-100 right-10">
                            <CustomAlert msg={alertMsg[1]} isError={alertMsg[0]}/>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="py-16 grid grid-rows-5 grid-cols-2 gap-8">
                        {loadingId ? (
                            <div className="col-span-2 row-span-2 flex justify-center">
                                <PointsLoader/>
                            </div>
                        ) : (
                            <>
                                {ownerAddress === "" ? (
                                    <>
                                        <div className="row-span-5 border-4 rounded-lg">
                                            <NFT_SVG_LG name={currentName}/>
                                        </div>
                                        <div className={"row-span-5 rounded-lg bg-main-orll w-full h-full py-8"}>
                                            <div
                                                className="flex justify-center text-white font-thin underline text-3xl md:text-5xl">
                                                <h1>Available to claim</h1>
                                            </div>
                                            <div
                                                className="my-8 mx-8 px-4 py-4 flex flex-row justify-center rounded-lg bg-main-orlll">
                                                <button
                                                    onClick={() => setIsDao(false)}
                                                    className={`text-white ${isDao ? "border-white" : "border-green-700"} bg-main-orl py-2 mx-16 flex-inline w-40 justify-center overflow-hidden font-medium rounded-lg border-4 hover:text-main-or`}>
                                                    User
                                                </button>
                                                <button
                                                    onClick={() => setIsDao(true)}
                                                    className={`text-white ${!isDao ? "border-white" : "border-green-700"} bg-main-orl mx-16 flex-inline w-40 justify-center overflow-hidden font-medium rounded-lg border-4 hover:text-main-or`}>
                                                    DAO
                                                </button>
                                            </div>
                                            <div className="my-4 mx-4 px-4 py-4">
                                                <input type="text" id="simple-search"
                                                       value={description}
                                                       onChange={handleChange}
                                                       className={"focus:outline-none placeholder:text-yellow-200 bg-white text-yellow-500 border border-4 border-dotted border-yellow-500 rounded-lg w-full pl-10 p-2.5 text-lg"}
                                                       placeholder="Status" required/>

                                            </div>
                                            <div className="w-full flex justify-center">
                                                <button
                                                    onClick={register}
                                                    className={`text-white border-white py-2 w-40 justify-center overflow-hidden font-medium rounded-lg border-2 group bg-gradient-to-br from-main-or to-main-orlll hover:text-main-or`}>
                                                    Claim
                                                </button>

                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {ownerAddress === walletAddress ? (
                                            <>
                                                <div className="row-span-5 border-4 rounded-lg">
                                                    <NFT_SVG_LG name={currentName}/>
                                                </div>
                                                <>
                                                    {!isDao ? (
                                                        <div className="col-span-2 md:col-span-1 rounded-lg row-span-3 border p-2">
                                                            <div>
                                                                <div
                                                                    className={"text-main-or text-center bg-main-orlll my-2 font-bold font-mono rounded-lg"}>
                                                                    {isDao ? (
                                                                        <p className={"underline py-2"}>DAO Status</p>
                                                                    ) : (
                                                                        <p className={"underline py-2"}>Your Status</p>
                                                                    )}
                                                                    <p className={"py-2"}>{description}</p>
                                                                </div>
                                                            </div>
                                                            <div className={"py-4 flex justify-center"}>
                                                                <div className={"px-8"} data-tip="Coming soon!">
                                                                    <WhiteButtonWithBorder
                                                                        action={() => setVisibleSt(true)}
                                                                        name={"Update status"}/>
                                                                </div>
                                                                <div className={"px-8"}>
                                                                    <WhiteButtonWithBorder name={"Update image"}/>
                                                                </div>
                                                            </div>
                                                            <div className={"py-4 flex justify-center"}>
                                                                <div className={"px-8"} data-tip="Coming soon!">
                                                                    <WhiteButtonWithBorder name={"Create TipLink"}/>
                                                                </div>
                                                                <div className={"px-8"}>
                                                                    <WhiteButtonWithBorder name={"Open chat"}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="col-span-2 md:col-span-1 rounded-lg row-span-2 border p-2">
                                                            <div>
                                                                <div
                                                                    className={"text-main-or text-center bg-main-orlll my-2 font-bold font-mono rounded-lg"}>
                                                                    {isDao ? (
                                                                        <p className={"underline py-2"}>DAO Status</p>
                                                                    ) : (
                                                                        <p className={"underline py-2"}>Your Status</p>
                                                                    )}
                                                                    <p className={"py-2"}>{description}</p>
                                                                </div>
                                                            </div>
                                                            <div className={"py-4 flex justify-center"}>
                                                                <div className={"px-8"} data-tip="Coming soon!">
                                                                    <WhiteButtonWithBorder
                                                                        action={() => setVisibleQ(true)}
                                                                        name={"Create quest"}/>
                                                                </div>
                                                                <div className={"px-8"}>
                                                                    <WhiteButtonWithBorder
                                                                        action={() => setVisibleA(true)}
                                                                        name={"Add to allowlist"}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                                <div className={`row-span-${isDao ? 3: 2} col-span-2 md:col-span-1 border rounded-lg p-2`}>
                                                    <div
                                                        className={"h-full text-main-or text-center bg-main-orlll font-bold font-mono rounded-lg"}>
                                                        {isDao ? (
                                                            <p className={"underline py-2"}>Available Quests</p>
                                                        ) : (
                                                            <p className={"underline py-2"}>Completed Quests</p>
                                                        )}
                                                        {completedQuests.length === 0 ? (
                                                            <p>-</p>
                                                        ) : (
                                                            <>
                                                                {completedQuests.map((object, i) =>
                                                                    <p>
                                                                        id:{object.id.split("-")[1]} | {object.name}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <InputPriceModalSt onClick={updateStatusOnchain} hidden={!visibleSt}
                                                                 setVisible={setVisibleSt}/>
                                                <InputPriceModalQ onClick={createQuestClick} hidden={!visibleQ}
                                                                 setVisible={setVisibleQ}/>
                                                <InputPriceModalA onClick={updateAllowlistClick} hidden={!visibleA}
                                                                 setVisible={setVisibleA}/>
                                            </>
                                        ) : (
                                            <>
                                                <div className="row-span-5 border-4 rounded-lg">
                                                    <NFT_SVG_LG name={currentName}/>
                                                </div>
                                                <div className="col-span-2 md:col-span-1 rounded-lg row-span-3 border p-2">
                                                    <div>
                                                        <div
                                                            className={"text-main-or text-center bg-main-orlll font-bold font-mono rounded-lg"}>
                                                            {isDao ? (
                                                                <p className={"underline py-2"}>DAO</p>
                                                            ) : (
                                                                <p className={"underline py-2"}>User</p>
                                                            )}
                                                            <p className={"py-2"}>{ownerAddress}</p>
                                                        </div>
                                                        <div
                                                            className={"text-main-or text-center bg-main-orlll my-2 font-bold font-mono rounded-lg"}>
                                                            <p className={"underline py-2"}>Status</p>
                                                            <p className={"py-2"}>{description}</p>
                                                        </div>
                                                    </div>
                                                    <div className={"py-4 flex justify-center"}>
                                                        <div className={"px-8"} data-tip="Coming soon!">
                                                            <WhiteButtonWithBorder name={"Chat"}/>
                                                        </div>
                                                        <div className={"px-8"}>
                                                            <WhiteButtonWithBorder name={"Tip"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row-span-2 col-span-2 md:col-span-1 border rounded-lg p-2">
                                                    <div
                                                        className={"h-full text-main-or text-center bg-main-orlll font-bold font-mono rounded-lg"}>
                                                        {isDao ? (
                                                            <p className={"underline py-2"}>Available Quests</p>
                                                        ) : (
                                                            <p className={"underline py-2"}>Completed Quests</p>
                                                        )}
                                                        {completedQuests.length === 0 ? (
                                                            <p>-</p>
                                                        ) : (
                                                            <>
                                                                {completedQuests.map((object, i) =>
                                                                    <p>
                                                                        {object.id} | {object.name}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>

    )


}

