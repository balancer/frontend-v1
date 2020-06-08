import { ethers } from 'ethers';

let provider;

// @ts-ignore
if (typeof window.ethereum !== 'undefined') {
  const ethereum = window['ethereum'];
  provider = new ethers.providers.Web3Provider(ethereum);
}

export default provider;
