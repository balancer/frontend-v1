import { ethers } from 'ethers';
import provider from '@/helpers/provider';

let web3;

if (provider) {
  web3 = new ethers.providers.Web3Provider(provider);
}

export default web3;
