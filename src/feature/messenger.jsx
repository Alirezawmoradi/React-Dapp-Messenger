import { WalletConnect } from "../components/wallet-connect.jsx";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { Abi } from "../abi/abi.js";

export const Messenger = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageValue, setMessageValue] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const contractAddress = "0xceD22a5efF952eCB791F57DE41865Cde4432C6B2";

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                try {
                    const accounts = await web3Instance.eth.requestAccounts();
                    setAccounts(accounts);
                    const contractInstance = new web3Instance.eth.Contract(
                        Abi,
                        contractAddress
                    );
                    setContract(contractInstance);

                    // Fetch initial messages and count
                    await getMessages();
                    await getMessagesCount();
                } catch (error) {
                    console.error("Error initializing Web3 or contract", error);
                }
            }
        };

        initWeb3();
    }, []);

    const sendMessage = async () => {
        if (!contract) return;
        setLoading(true);
        try {
            await contract.methods
                .createMessage(String(messageValue))
                .send({ from: accounts[0] });
            setMessageValue("");
            await getMessages(); // Refresh messages
            await getMessagesCount(); // Refresh message count
        } catch (error) {
            console.error("Error sending message", error);
        } finally {
            setLoading(false);
        }
    };

    const getMessages = async () => {
        if (!contract || !accounts.length) return;
        setLoading(true);
        try {
            // Fetch messages from the contract
            const messagesArray = await contract.methods.getMessages(accounts[0]).call();
            console.log("Fetched messages:", messagesArray); // Debug log

            // Filter out messages with invalid timestamps
            const validMessages = messagesArray.filter(msg => {
                const timestamp = Number(msg.timestamp);
                return timestamp > 0; // Ensure the timestamp is valid
            });

            // Update state with valid messages
            setMessages(validMessages.map((msg, index) => {
                const timestamp = Number(msg.timestamp);
                return (
                    <div key={index}
                         className="bg-gray-700 p-3 rounded-lg shadow-md mb-2 w-full flex justify-between items-center">
                        <div>
                            <p className="text-lg">{msg.message}</p>
                            <p className="text-sm text-gray-400">{new Date(timestamp * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                );
            }));
        } catch (error) {
            console.error("Error getting messages", error);
        } finally {
            setLoading(false);
        }
    };

    const getMessagesCount = async () => {
        if (!contract || !accounts.length) return;
        setLoading(true);
        try {
            const count = await contract.methods.getMessagesCount(accounts[0]).call();
            setMessageCount(Number(count));
        } catch (error) {
            console.error("Error getting message count", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg">
            <div className='p-5 border-b border-gray-700'>
                <WalletConnect/>
            </div>
            <div className='flex-1 overflow-auto p-4'>
                {messages.length > 0 ? messages : <p className="text-center text-gray-500">No messages found.</p>}
            </div>
            <div className='p-4 border-t border-gray-700'>
                <div className='flex gap-2'>
                    <input
                        className='bg-gray-700 text-white px-4 py-2 rounded-lg shadow-inner flex-1'
                        type='text'
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        placeholder='Type a message...'
                    />
                    <button
                        className='bg-blue-600 px-4 py-2 rounded-lg text-white shadow-md hover:bg-blue-500 transition'
                        onClick={sendMessage}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                    <button
                        className='bg-red-600 px-4 py-2 rounded-lg text-white shadow-md hover:bg-red-500 transition'
                        onClick={getMessages}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load'}
                    </button>
                    <button
                        className='bg-green-600 px-4 py-2 rounded-lg text-white shadow-md hover:bg-green-500 transition'
                        onClick={getMessagesCount}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Count'}
                    </button>
                </div>
                <div className='mt-4 text-center'>
                    <p>Total Messages: {messageCount}</p>
                </div>
            </div>
        </div>
    );
};
