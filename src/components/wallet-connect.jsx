import {useSDK} from "@metamask/sdk-react";
import React, {useState} from "react";

export const WalletConnect = () => {
    const [account, setAccount] = useState();
    const {sdk, connected, connecting, provider, chainId} = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <button className='my-10 bg-blue-700 rounded-full shadow-md w-32 h-10 hover:bg-blue-800 transition duration-300' onClick={connect}>
                Connect
            </button>
            {connected && (
                <div>
                    <>
                        {chainId && `Connected chain: ${chainId}`}
                        <p></p>
                        {account && `Connected account: ${account}`}
                    </>
                </div>
            )}
        </div>
    );
};