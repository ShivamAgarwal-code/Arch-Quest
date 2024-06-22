import {useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";


export default function LandingPage() {

    const [request, setRequest] = useState('');
    const [alert, setAlert] = useState(false)

    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        navigate('/name/'+request, {replace: true})
    }

    const handleChange = (e) => {
        const value = e.target.value
        let valueUpd = value.replace(/[^a-z0-9]/gi, "");
        if (valueUpd.length > 24) {
            valueUpd = valueUpd.substr(0, 24)
        }
        if (value !== valueUpd) {
            if (!alert) {
                setAlert(true)
                setTimeout(function () {
                    setAlert(false)
                }, 3000);
            }
        } else {
            setAlert(false)
        }
        setRequest(valueUpd.toLowerCase());
    };



    return (

        <div className="bg-gradient-to-b from-main-or to-main-orlll min-h-screen">
            <div className="max-w-screen-2xl mx-auto">
                <div className="max-w-7xl mx-auto py-8 px-8">
                    <div className="grid-cols-12 grid">
                        <div
                            className="pt-5 sm:pt-10 md:pt-20 place-self-center col-span-12 col-start-1 text-white font-bold text-3xl md:text-7xl sm:text-5xl text-center">
                            <h1>Decentralized Digital Identities </h1>
                            <h1>for Archway Ecosystem</h1>
                        </div>
                        <div
                            className="pt-5 sm:pt-10 text-center place-self-center col-span-12 col-start-1 text-white font-extralight text-lg sm:text-2xl text-center">
                            <h3>Create your ID and participate in quests from various DAOs!</h3>
                        </div>
                        <form className="pt-5 sm:pt-10 flex items-center col-span-12 col-start-1 sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-4"
                              onSubmit={submitForm}>
                            <div className="relative w-full">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-500"
                                         fill="currentColor"
                                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <input type="text" id="simple-search"
                                       value={request}
                                       onChange={handleChange}
                                       className={!alert ? "focus:outline-none placeholder:text-yellow-200 bg-white text-yellow-500 border border-4 border-dotted border-yellow-500 rounded-lg w-full pl-10 p-2.5 text-lg" :
                                           "focus:outline-none placeholder:text-yellow-200 bg-white text-yellow-500 border-2 border-red-600 rounded-lg w-full pl-10 p-2.5 text-lg"}
                                       placeholder="Search ID" required/>
                            </div>
                            <button type="submit"
                                    className="p-2.5 ml-2 text-sm font-medium text-white bg-gradient-to-br from-main-orl to-main-or rounded-lg hover:from-main-orll hover:to-main-orl">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </button>
                        </form>
                        <div className="col-span-12 gap-10 flex justify-center">

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )


}



