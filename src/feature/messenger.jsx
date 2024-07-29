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
        setLoading(true);
        try {
            await contract.methods
                .createMessage(String(messageValue))
                .send({ from: accounts[0] });
            setMessageValue("");
            console.log("Message Sent", messageValue);
            getMessagesCount(); // Update message count after sending a new message
        } catch (error) {
            console.error("Error sending message", error);
        } finally {
            setLoading(false);
        }
    };

    const getMessages = async () => {
        setLoading(true);
        try {
            const messagesArray = await contract.methods.getMessages(accounts[0]).call();
            console.log("Messages Received", messagesArray);
            setMessages(messagesArray.map((msg, index) => {
                // Convert BigInt timestamp to a Number for safe operations
                const timestamp = Number(msg.timestamp);
                return (
                    <div key={index}>
                        <p>Message: {msg.message}</p>
                        <p>Timestamp: {new Date(timestamp * 1000).toLocaleString()}</p>
                    </div>
                );
            }));
        } catch (error) {
            console.error("Error getting messages", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (index) => {
        setLoading(true);
        try {
            await contract.methods.deleteMessage(index).send({ from: accounts[0] });
            console.log("Message Deleted");
            getMessagesCount(); // Update message count after deleting a message
        } catch (error) {
            console.error("Error deleting message", error);
        } finally {
            setLoading(false);
        }
    };

    const getMessagesCount = async () => {
        setLoading(true);
        try {
            const count = await contract.methods.getMessagesCount(accounts[0]).call();
            console.log(`Total messages: ${count}`);
            setMessageCount(count);
        } catch (error) {
            console.error("Error getting message count", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className='p-10'>
                <WalletConnect />
            </div>
            <div className='flex gap-2'>
                <input
                    className='bg-gray-600 px-2 py-2 rounded-md shadow-md'
                    type='text'
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    placeholder='Send Message Here...'
                />
                <button
                    className='bg-red-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={sendMessage}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Create'}
                </button>
                <button
                    className='bg-blue-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={getMessages}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Messages'}
                </button>
                <button
                    className='bg-yellow-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={() => deleteMessage(0)} // Example index, replace with actual index
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Message'}
                </button>
                <button
                    className='bg-green-500 p-2 rounded-md text-white shadow-md active:scale-90 transition'
                    onClick={getMessagesCount}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Message Count'}
                </button>
            </div>
            <div className='mt-4'>
                {messages}
            </div>
            <div className='mt-4'>
                <p>Total Messages: {messageCount}</p>
            </div>
        </div>
    );
};
