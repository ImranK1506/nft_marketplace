import React, { useState, useEffect } from 'react';
// Web3 / Ethereum provider solution for all wallets
import Web3Modal from 'web3modal';
// Ethereum wallet implementation
import { ethers } from 'ethers';
import axios from 'axios';

import { MartketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const nftCurrency = 'MATIC';

  return (
    <NFTContext.Provider value={{ nftCurrency }}>
      {children}
    </NFTContext.Provider>
  );
};
