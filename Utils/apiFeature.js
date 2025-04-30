import { ethers } from "ethers";
// import Web3Modal from "web3modal";

require('dotenv').config();

import { KKMChatAppAddress, MASTER_PRIVATE_KEY, ETHEREUM_RPC_URL, KKMChatAppABI } from "@/Context/constants";

export const CheckIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Wallet is not connected.");
  
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
  
      // const firstAccount = accounts[0];
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  // New function to generate a wallet
export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  console.log("Generated wallet - Address:", wallet.address, "Private Key:", wallet.privateKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

// New function to fund a wallet
export const fundWallet = async (userAddress, amountInEth) => {
  try {
    console.log("Initializing provider for funding...");
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || ETHEREUM_RPC_URL);
    console.log("Provider initialized, checking master private key...");
    const masterPrivateKey = MASTER_PRIVATE_KEY;
    if (!masterPrivateKey) throw new Error("MASTER_PRIVATE_KEY is not set in .env");
    console.log("Master Private Key loaded (masked for security):", masterPrivateKey.slice(0, 6) + "...");

    const masterWallet = new ethers.Wallet(masterPrivateKey, provider);
    console.log("Master wallet address:", masterWallet.address);

    console.log(`Parsing ${amountInEth} ETH to wei...`);
    const amountInWei = ethers.utils.parseEther(amountInEth); // Explicitly use utils.parseEther
    console.log(`Parsed amount in wei: ${amountInWei.toString()}`);

    console.log(`Sending ${amountInEth} ETH to ${userAddress}...`);
    const tx = await masterWallet.sendTransaction({
      to: userAddress,
      value: amountInWei,
    });
    await tx.wait();
    console.log(`Funding successful, TX hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error("Error in fundWallet:", error.message, error.stack);
    throw error;
  }
};

// Modified connectWallet to use generated wallet (temporary until backend integration)
export const connectWallet = async () => {
  const newWallet = generateWallet();
  // For now, return the address; later, we’ll store the private key securely
  return newWallet.address;
};
  
  /* export const connectWallet = async () => {
    try {  
      if (!window.ethereum) return console.log("Install MetaMask");
  
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const firstAccount = accounts[0];
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  }; */
  
  const fetchContract = (signerOrProvider) =>
    new ethers.Contract(KKMChatAppAddress, KKMChatAppABI, signerOrProvider);
  
  export const connectingWithContract = async (privateKey) => {
    try {
      console.log("Attempting to connect with contract...");
      // Temporarily use a static provider until we integrate the new wallet's signer
      // const web3modal = new Web3Modal();
      // const connection = await web3modal.connect();
      // const provider = new ethers.providers.Web3Provider(connection);
      // const signer = provider.getSigner();
      // const contract = fetchContract(signer);

      const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || ETHEREUM_RPC_URL);
      console.log("Provider initialized for contract connection...");
      // Create a wallet instance with the provided private key
      const signer = new ethers.Wallet(privateKey, provider);
      console.log("Wallet created for signing, address:", signer.address);
      // const signer = provider.getSigner(); // This will use the first account; we'll fix this later
      const contract = fetchContract(signer);
      console.log("Contract connected, address:", KKMChatAppAddress);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const convertTime = (time) => {
    //const newTime = new Date(time.toNumber());
    const newTime = new Date(time.toNumber()* 1000);
  
    const realTime =
      newTime.getHours() +
      "h:" +
      newTime.getMinutes() +
      "m:" +
      newTime.getSeconds() +
      "s  Date:" +
      newTime.getDate() +
      "/" +
      (newTime.getMonth() + 1) +
      "/" +
      newTime.getFullYear();
  
    return realTime;
  };

  // export const convertTime = (time) => {
  //   const newTime = new Date(time);
  
  //   const padZero = (num) => (num < 10 ? '0' : '') + num;
  
  //   const hours = padZero(newTime.getHours());
  //   const minutes = padZero(newTime.getMinutes());
  //   const seconds = padZero(newTime.getSeconds());
  //   const day = padZero(newTime.getDate());
  //   const month = padZero(newTime.getMonth() + 1); // Months are zero-indexed
  //   const year = newTime.getFullYear();
  
  //   const realTime = hours + ":" + minutes + ":" + seconds + " Date: " + day + "/" + month + "/" + year;
  
  //   return realTime;
  // };