import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// INTERNAL IMPORT
import { 
    CheckIfWalletConnected, 
    connectWallet, 
    connectingWithContract, 
} from '@/Utils/apiFeature';

import { create } from 'ipfs-http-client';

export const KKMChatAppContext = React.createContext();

const ipfs = create({ url: 'http://192.168.0.104:5001' });

export const KKMChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      //GET USER NAME
      const userName = await contract.getUsername(connectAccount);
      setUserName(userName);
      //GET MY FRIEND LIST
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      //GET ALL APP USER LIST
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
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
      const contract = await connectingWithContract();
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
    console.log(name, account);
    try {
      if (!name || !account)
        return setError("Name And Account Address, cannot be empty");

      const contract = await connectingWithContract();
      console.log(contract);
      const getCreatedUser = await contract.createAccount(name);

      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account Pleas reload browser");
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(userAddress, name);
      setLoading(true);
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
    console.log(msg, address);
    try {
      if (!address) return setError("Please provide the address");

      let ipfsHash = "";
      let fileName = "";
      let fileType = "";

      // If a file is provided, upload it to IPFS  
      if (file) {
        const addedFile = await ipfs.add(file); // Upload file to IPFS
        ipfsHash = addedFile.path; // Get the IPFS hash of the file
        fileName = file.name; // Get the file name from the file object
        fileType = file.type; // Get the file type from the file object
      }

      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg, ipfsHash, fileName, fileType);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
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
    const contract = await connectingWithContract();
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
      }}
    >
      {children}
    </KKMChatAppContext.Provider>
  );
};