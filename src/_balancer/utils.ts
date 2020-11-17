import { getAddress } from '@ethersproject/address';
import { multicall } from '@snapshot-labs/snapshot.js/src/utils';
import config from '../config';
import abi from '@/helpers/abi';
import registry from '@/_balancer/registry';

export function getTokenLogoUrl(address: string): string | null {
  if (address === 'ether') {
    address = config.addresses.weth;
  }
  address = getAddress(address);
  const metadata = config.tokens[address];
  if (!metadata) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  }
  return metadata.logoUrl;
}

export async function getBalances(
  network,
  provider,
  address,
  tokens: string[]
) {
  const result = await multicall(
    network,
    provider,
    abi['BPool'],
    tokens.map(token => [token, 'balanceOf', [address]])
  );
  return Object.fromEntries(
    result
      .map(([balance], i) => [tokens[i], balance.toString()])
      .filter(balance => balance[1] !== '0')
  );
}

export async function getPoolShares(network, provider, address: string) {
  const poolIds = registry.getPoolIds();
  return await getBalances(network, provider, address, poolIds);
}
