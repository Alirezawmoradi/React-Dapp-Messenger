import {WalletConnect} from "../components/wallet-connect.jsx";
import {useEffect, useState} from "react";
import Web3 from "web3";
import {Abi} from "../abi/abi.js";


export const Messenger = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("");
    const [messageValue, setMessageValue] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const contractAddress = "0xceD22a5efF952eCB791F57DE41865Cde4432C6B2";

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const accounts = await web3Instance.eth.requestAccounts();
                setAccounts(accounts);
                const contractInstance = new web3Instance.eth.Contract(
                    Abi,
                    contractAddress
                );
                setContract(contractInstance);
            }
        };

        initWeb3();
    }, []);

    const sendMessage = async () => {
        await contract.methods
            .createMessage(String(messageValue))
            .send({from: accounts[0]});
        setMessageValue("");

        console.log("Message Sent", messageValue);
    };

    const getMessage = async () => {
        const messages = await contract.methods.getMessages(accounts[0]).call();
        console.log("Messages Received", messages);
        setMessage(messages.map((msg, index) => (
            <div key={index}>
                <p>Message: {msg.message}</p>
                <p>Timestamp: {msg.timestamp}</p>
            </div>
        )));
    };

    const deleteMessage = async (index) => {
        await contract.methods.deleteMessage(index).send({from: accounts[0]});
        console.log("Message Deleted");
    };

    const getMessagesCount = async () => {
        const count = await contract.methods.getMessagesCount(accounts[0]).call();
        console.log(`Total messages: ${count}`);
        setMessageCount(count);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className='p-10'>
                <WalletConnect/>
            </div>
            <div className='flex gap-2'>
                <input className='bg-gray-600 px-2 py-2 rounded-md shadow-md' type='text'
                       value={messageValue}
                       onChange={(e) => setMessageValue(e.target.value)}
                       placeholder='Eend Message Here...'/>
                <button className='bg-red-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                        onClick={sendMessage}>Create
                </button>
                <button className='bg-blue-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                        onClick={getMessage}>Get Message
                </button>
                <button
                    className='bg-yellow-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={() => deleteMessage(0)} // Example index, replace with actual index
                >
                    Delete Message
                </button>
                <button
                    className='bg-green-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={getMessagesCount}
                >
                    Get Message Count
                </button>
                <div className='flex-col'>
                    {message}
                </div>
                <div className='mt-4'>
                    <p>Total Messages: {messageCount}</p>
                </div>
            </div>
        </div>
    )
}