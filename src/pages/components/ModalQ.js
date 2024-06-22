import React, {useState} from 'react';

const InputPriceModalQ = ({hidden, setVisible, onClick}) => {

    const [field1, setField1] = useState('')
    const [field2, setField2] = useState('')

    return (
        <div>
            {hidden
                ? <></>
                :
                <div className="fixed inset-0 bg-gray-600 bg-opacity-90 overflow-y-auto
                                                    h-full w-full grid place-items-center">
                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button"
                                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                    data-modal-toggle="popup-modal"
                                    onClick={() => setVisible(false)}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div className="p-6 text-center">

                                <h2 className="text-yellow-700 font-extrabold text-3xl mb-10">
                                    Create Quest
                                </h2>

                                <div className="flex border-2 border-main-orll rounded-lg">
                                    <input className="w-full rounded-lg p-2"
                                           placeholder="Quest name"
                                           value={field1}
                                           onChange={e => setField1(e.target.value)}
                                    />

                                </div>
                                <div className="flex mt-2 border-2 border-main-orll rounded-lg">
                                    <input className="w-full rounded-lg p-2"
                                           placeholder="Quest description"
                                           value={field2}
                                           onChange={e => setField2(e.target.value)}
                                    />
                                </div>


                                <button data-modal-toggle="popup-modal" type="button"
                                        onClick={() => onClick(field1, field2)}
                                        className="mt-4 text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Create
                                </button>
                                <button data-modal-toggle="popup-modal" type="button" onClick={() => setVisible(false)}
                                        className="mt-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
                                    cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default InputPriceModalQ;