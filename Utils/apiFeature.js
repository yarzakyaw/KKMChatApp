import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { KKMChatAppAddress, KKMChatAppABI } from "@/Context/constants";

export const CheckIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
  
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
  
      const firstAccount = accounts[0];
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const connectWallet = async () => {
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
  };
  
  const fetchContract = (signerOrProvider) =>
    new ethers.Contract(KKMChatAppAddress, KKMChatAppABI, signerOrProvider);
  
  export const connectingWithContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
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