export const Abi = [
    {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "address", "name": "sender", "type": "address"}, {
            "indexed": false,
            "internalType": "string",
            "name": "message",
            "type": "string"
        }, {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}],
        "name": "MessageCreated",
        "type": "event"
    }, {
        "inputs": [{"internalType": "string", "name": "_message", "type": "string"}],
        "name": "createMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "deleteMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
        "name": "getMessages",
        "outputs": [{
            "components": [{
                "internalType": "string",
                "name": "message",
                "type": "string"
            }, {"internalType": "uint256", "name": "timestamp", "type": "uint256"}],
            "internalType": "struct Message.MessageData[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}],
        "name": "getMessagesCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}, {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "messages",
        "outputs": [{"internalType": "string", "name": "message", "type": "string"}, {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }]
