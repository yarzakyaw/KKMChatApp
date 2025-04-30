import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// INTERNAL IMPORT
import { 
    CheckIfWalletConnected, 
    connectWallet, 
    connectingWithContract, 
    generateWallet,
    fundWallet,
} from '@/Utils/apiFeature';

import { create } from 'ipfs-http-client';
import { IPFS_SERVER_URL } from "@/Context/constants";

export const KKMChatAppContext = React.createContext();

const ipfs = create({ url: IPFS_SERVER_URL });

export const KKMChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");
  const [privateKey, setPrivateKey] = useState(""); // New state for private key

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      const storedPrivateKey = localStorage.getItem("userPrivateKey");
      const storedAccount = localStorage.getItem("userAddress");
      console.log("Retrieved from localStorage - Address:", storedAccount, "Private Key:", storedPrivateKey ? storedPrivateKey.slice(0, 6) + "..." : "null");
      if (!storedPrivateKey || !storedAccount) {
        console.log("No stored wallet found, user needs to register");
        return;
      }

      setAccount(storedAccount);
      setPrivateKey(storedPrivateKey);

      // Connect to contract using stored private key
      const contract = await connectingWithContract(storedPrivateKey);
      console.log("Connected to contract in fetchData");

      // GET USERNAME
      const userName = await contract.getUsername(storedAccount);
      setUserName(userName || "");
      console.log("Fetched username:", userName);

      // GET MY FRIEND LIST
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      console.log("Fetched friend list:", friendLists);

      // GET ALL APP USER LIST
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
      console.log("Fetched user list:", userList);

      //GET CONTRACT
      // const contract = await connectingWithContract();
      //GET ACCOUNT
      // const connectAccount = await connectWallet();
      // setAccount(connectAccount);
      //GET USER NAME
      // Only fetch username if account exists
      // if (connectAccount && contract) {
      //   const userName = await contract.getUsername(connectAccount);
      //   setUserName(userName || ""); // Default to empty string if undefined
      // }
      // const userName = await contract.getUsername(connectAccount);
      // setUserName(userName);
      //GET MY FRIEND LIST
      // const friendLists = await contract.getMyFriendList();
      // setFriendLists(friendLists);
      //GET ALL APP USER LIST
      // const userList = await contract.getAllAppUser();
      // setUserLists(userList);
    } catch (error) {
      // setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const storedPrivateKey = localStorage.getItem("userPrivateKey");
      if (!storedPrivateKey) {
        setError("No wallet found, please register");
        return;
      }
      const contract = await connectingWithContract(storedPrivateKey);
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  //READ FILE FROM YOUR FRIEND
  /* const readFile = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const fileHash = await contract.readFiles(friendAddress); // Call your smart contract method
      const file = await ipfs.cat(fileHash); // Retrieve the file from IPFS
      const fileContent = new TextDecoder().decode(file); // Decode the file content
      console.log("File content:", fileContent); // Use the file content as needed
    } catch (error) {
      console.log("Error reading file:", error);
    }
  }; */

  //CREATE ACCOUNT
  const createAccount = async ({ name }) => {
    console.log("Starting createAccount with name:", name);
    try {
      if (!name)
        return setError("Name cannot be empty");

      // Generate and fund a new wallet
      setLoading(true);
      console.log("Generating new wallet...");
      const newWallet = generateWallet();
      console.log("New wallet created - Address:", newWallet.address);
      console.log("New wallet private key:", newWallet.privateKey); 
      setAccount(newWallet.address);
      setPrivateKey(newWallet.privateKey); // Store private key (to be encrypted later)

      // Store in localStorage (temporary, will secure later)
      localStorage.setItem("userPrivateKey", newWallet.privateKey);
      localStorage.setItem("userAddress", newWallet.address);
      console.log("Stored wallet in localStorage - Address:", newWallet.address);

      console.log("Funding new wallet with 0.01 ETH...");
      await fundWallet(newWallet.address, "0.01"); // Fund with 0.01 ETH
      console.log("Wallet funded successfully for address:", newWallet.address);

      // const contract = await connectingWithContract();
      // Use the new wallet's private key to connect to the contract
      const contract = await connectingWithContract(newWallet.privateKey);
      console.log("Calling smart contract to create account for:", newWallet.address);
      const getCreatedUser = await contract.createAccount(name);
      console.log("Transaction sent for createAccount, waiting for confirmation...");

      // setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      console.log("Account created successfully for:", name, "with address:", newWallet.address);
      window.location.reload();
    } catch (error) {
      console.error("Error in createAccount:", error.message);
      setError("Error while creating your account Please reload browser");
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");

      const storedPrivateKey = localStorage.getItem("userPrivateKey");
      if (!storedPrivateKey) {
        setError("No wallet found, please register");
        return;
      }

      setLoading(true);
      const contract = await connectingWithContract(storedPrivateKey);
      const addMyFriend = await contract.addFriend(userAddress, name);
      // setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, address, file }) => {
    console.log("Starting sendMessage - Message:", msg, "Address:", address, "File:", file ? file.name : "none");
    try {
      if (!address) {
        console.error("No address provided for sendMessage");
        return setError("Please provide the address");
      }

      const storedPrivateKey = localStorage.getItem("userPrivateKey");
      console.log("Retrieved private key from localStorage:", storedPrivateKey ? storedPrivateKey.slice(0, 6) + "..." : "null");
      if (!storedPrivateKey) {
        console.error("No private key found in localStorage");
        setError("No wallet found, please register");
        return;
      }

      let ipfsHash = "";
      let fileName = "";
      let fileType = "";

      // If a file is provided, upload it to IPFS  
      if (file) {
        console.log("Uploading file to IPFS:", file.name);
        const addedFile = await ipfs.add(file); // Upload file to IPFS
        ipfsHash = addedFile.path; // Get the IPFS hash of the file
        fileName = file.name; // Get the file name from the file object
        fileType = file.type; // Get the file type from the file object
        console.log("File uploaded to IPFS - Hash:", ipfsHash, "Name:", fileName, "Type:", fileType);
      }

      console.log("Connecting to contract with private key...");
      const contract = await connectingWithContract(storedPrivateKey);
      console.log("Contract connected, sending message...");
      const addMessage = await contract.sendMessage(address, msg, ipfsHash, fileName, fileType);
      console.log("Message transaction sent, waiting for confirmation...");

      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      console.log("Message sent successfully to:", address);
      // window.location.reload();
    } catch (error) {
      console.error("Error in sendMessage:", error.message, error.stack);
      setError("Please reload and try again");
    }
  };
  /* const sendMessage = async ({ msg, address }) => {
    console.log(msg, address);
    try {
      if (!msg || !address) return setError("Please Type your Message");

      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
    }
  }; */

  //SEND FILE TO YOUR FRIEND  
  /* const sendFile = async ({ file, address }) => {
    try {
      if (!file || !address) return setError("Please select a file and provide the address");

      const addedFile = await ipfs.add(file); // Upload file to IPFS
      const fileHash = addedFile.path; // Get the IPFS hash of the file

      const contract = await connectingWithContract();
      const addFile = await contract.sendFile(address, fileHash); // Call your smart contract method
      setLoading(true);
      await addFile.wait();
      setLoading(false);
      window.location.reload(); 
    } catch (error) {
      setError("Error sending file. Please try again.");
    }
  }; */

  //READ INFO
  const readUser = async (userAddress) => {
    const storedPrivateKey = localStorage.getItem("userPrivateKey");
    if (!storedPrivateKey) {
      setError("No wallet found, please register");
      return;
    }

    const contract = await connectingWithContract(storedPrivateKey);
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };
  
  return (
    <KKMChatAppContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
        privateKey, // Expose private key for next steps
      }}
    >
      {children}
    </KKMChatAppContext.Provider>
  );
};