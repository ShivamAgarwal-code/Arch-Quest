import { useState } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import {connectKeplr} from "./connectKeplr";
import {ChainInfo} from "../api/chain-info";


export const useWallet = () => {
    const [signingClient, setSigningClient] =
    useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gasPrice, setGasPrice] = useState(null);

    const connectWallet = async () => {
        setLoading(true);

        try {
            await connectKeplr();
            const offlineSigner = await window.getOfflineSigner(ChainInfo.chainId);

            // get user address
            const [{ address }] = await offlineSigner.getAccounts();
            setWalletAddress(address);
            // Gas price
            setGasPrice(GasPrice.fromString('0.002utorii'));

            // make client
            setSigningClient(
                await SigningCosmWasmClient.connectWithSigner(
                    ChainInfo.rpc,
                    offlineSigner,
                ),
            );

            setLoading(false);
        } catch (error) {
            setError(error);
        }
    };

    const disconnect = () => {
        if (signingClient) {
            signingClient.disconnect();
        }
        setWalletAddress('');
        setSigningClient(null);
        setLoading(false);
        setGasPrice(null);
    };

    return {
        walletAddress,
        signingClient,
        loading,
        error,
        connectWallet,
        disconnect,
        gasPrice,
    };
};