import {ChainInfo} from "../api/chain-info";


export async function connectKeplr() {
    if (window['keplr']) {
        if (window.keplr['experimentalSuggestChain']) {
            await window.keplr.experimentalSuggestChain(ChainInfo);
            await window.keplr.enable(ChainInfo.chainId);
        } else {
            console.warn(
                'Error accessing experimental features, please update Keplr',
            );
        }
    } else {
        console.warn('Error accessing Keplr, please install Keplr');
    }
}