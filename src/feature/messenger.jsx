import {WalletConnect} from "../components/wallet-connect.jsx";
import {useEffect, useState} from "react";
import Web3 from "web3";
import {Abi} from "../abi/abi.js";
import {LiaHistorySolid} from "react-icons/lia";
import {GrSend} from "react-icons/gr";

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
                    await getMessages();
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
                .send({from: accounts[0]});
            setMessageValue("");
            await getMessages();
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
            const messagesArray = await contract.methods.getMessages(accounts[0]).call();
            console.log("Fetched messages:", messagesArray); // Debug log

            const validMessages = messagesArray.filter(msg => {
                const timestamp = Number(msg.timestamp);
                return timestamp > 0; // Ensure the timestamp is valid
            });

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
            const count = await contract.methods.getMessagesCount(accounts[0]).call();
            setMessageCount(Number(count));
        } catch (error) {
            console.error("Error getting messages", error);
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
                {messages.length > 0 ? messages : <p className="text-center text-gray-500">No messages found...</p>}
            </div>
            <div className='gap-2 mb-2 ml-5 text-left text-sm text-gray-500'>
                <p className={`${!messageCount ? 'hidden' : ''}`}>Total Messages : {messageCount - 2}</p>
            </div>
            <div className='p-4 border-t border-gray-700'>
                <div className='flex items-center gap-2'>
                    <input
                        className='bg-gray-700 text-white px-4 py-2 rounded-lg shadow-inner flex-1'
                        type='text'
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        placeholder='Type a message...'
                    />
                    <GrSend
                        className='text-blue-600 text-2xl hover:text-blue-500 transition duration-300 hover:cursor-pointer'
                        onClick={sendMessage}
                        disabled={loading}
                    />
                    <LiaHistorySolid
                        className='text-2xl text-gray-400 hover:text-gray-100 transition duration-300 hover:cursor-pointer'
                        onClick={getMessages}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};
