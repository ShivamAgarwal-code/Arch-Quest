import { createContext, useContext, ReactNode } from 'react'
import {useWallet} from "./useWallet";

let CosmWasmContext;
let {Provider} = (CosmWasmContext = createContext({
    walletAddress: '',
    signingClient: null,
    loading: false,
    error: null,
    connectWallet: () => {},
    disconnect: () => {},
    gasPrice: 0
}))

export const useSigningClient = () =>
    useContext(CosmWasmContext)

export const SigningCosmWasmProvider = ({children}) => {
    const value = useWallet();
    return <Provider value={value}>{children}</Provider>
}