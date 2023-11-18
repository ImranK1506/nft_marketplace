import React, { useEffect, useState } from 'react';
// Web3 / Ethereum provider solution for all wallets
import Web3Modal from 'web3modal';
// Ethereum wallet implementation
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { MarketAddress, MarketAddressABI } from './constants';

const auth = `Basic ${Buffer.from(`${process.env.INFURA_KEY}:${process.env.INFURA_SECRET}`).toString('base64')}`;

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

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    // Establish connection to wallet
    const connection = await web3Modal.connect();
    // Get provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get signer (who is making the sale/nft)
    const signer = provider.getSigner();
    // Get contract instance v5
    // const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    // Get contract instance v6
    const price = ethers.parseUnits(formInputPrice, 'ether');
    // Fetch contract ABI
    const nftContract = fetchContract(signer);
    console.log('NFT Contract', nftContract);
    // Get listing price
    const listingPrice = await nftContract.getListingPrice();
    console.log('Listing price', listingPrice.toString());
    // Create token
    const transaction = await nftContract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait();
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

  // const createSale = async (url, formInputPrice, isReselling, id) => {
  //   console.log('sale');
  //   const web3Modal = new Web3Modal();
  //   // Establish connection to wallet
  //   const connection = await web3Modal.connect();
  //   // Get provider
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   // Get signer (who is making the sale/nft)
  //   const signer = provider.getSigner();
  //   // Get contract instance
  //   const price = ethers.utils.parseUnits(formInputPrice, 'ether');
  //   // Fetch contract ABI
  //   const nftContract = fetchContract(signer);
  //   console.log('NFT Contract', nftContract);
  //   // Get listing price
  //   const listingPrice = await nftContract.getListingPrice();
  //   // Create token
  //   const transaction = await nftContract.createToken(url, price, { value: listingPrice.toString() });
  //
  //   await transaction.wait();
  // };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    console.log('Uploading file to IPFS');

    try {
      const added = await client.add(data);
      console.log('IPFS added', added);
      const url = `https://jsmastery-nft-marketplace.infura-ipfs.io/ipfs/${added.path}`;
      console.log('URL', url);
      await createSale(url, price);

      console.log('NFT created successfully!');

      // Push to homepage
      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS');
    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT }}>
      {children}
    </NFTContext.Provider>
  );
};
