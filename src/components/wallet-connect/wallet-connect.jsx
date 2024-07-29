import { useSDK } from "@metamask/sdk-react";
import React, { useState } from "react";
import MetaMaskLogo from "../metaMask-logo/metaMaskLogo.jsx";

export const WalletConnect = () => {
    const [account, setAccount] = useState();
    const { sdk, connected, connecting, provider, chainId } = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-4">
            {/*<div className="w-52 h-52">*/}
                <MetaMaskLogo />
            {/*</div>*/}
            <button
                className='bg-blue-700 rounded-full shadow-md w-32 h-10 hover:bg-blue-800 transition duration-300 disabled:bg-blue-900'
                onClick={connect}
                disabled={!connected || connecting}
            >
                Connect
            </button>
            {connected && (
                <div className='flex flex-col gap-2 justify-center items-center'>
                    {chainId && <div>Connected chain: {chainId}</div>}
                    {account && <div>Connected account: {account}</div>}
                </div>
            )}
        </div>
    );
};
