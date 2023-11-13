import React, { useEffect, useState } from 'react';
// Web3 / Ethereum provider solution for all wallets
// Ethereum wallet implementation
import { create as ipfsHttpClient } from 'ipfs-http-client';

// const infuraKey = '2XzXKmur7a3wYRhaiUveZwblIG8';
// const projectSecret = 'e3de6eb467089c1f4200fa54adc79072';
const auth = `Basic ${Buffer.from(`${process.env.INFURA_KEY}:${process.env.INFURA_SECRET}`).toString('base64')}`;
console.log(auth);
const client = ipfsHttpClient(
  {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    },
  },
);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'MATIC';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      return `https://jsmastery-nft-marketplace.infura-ipfs.io/ipfs/${added.path}`;
    } catch (error) {
      console.log('Error uploading file');
    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </NFTContext.Provider>
  );
};
