import { Contract } from '@ethersproject/contracts';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';

export async function canProvideLiquidity(crpAddress, walletAddress) {
  const crpContract = new Contract( 
    crpAddress, 
    abi['ConfigurableRightsPool'], 
    provider 
  ); 
  return await crpContract.canProvideLiquidity(walletAddress); 
}