import { getAddress } from '@ethersproject/address';
import { hexZeroPad } from '@ethersproject/bytes';
import { id } from '@ethersproject/hash';
import { resolveProperties } from '@ethersproject/properties';
import { multicall } from '@snapshot-labs/snapshot.js/src/utils';
import config from '../config';
import abi from '@/helpers/abi';
import { formatUnits } from '@ethersproject/units';

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
    result.map(([balance], i) => [tokens[i], balance.toString()])
  );
}

export async function getPoolSharesByAddress(
  network,
  provider,
  proxyAddress: string,
  address: string
) {
  const events = await resolveProperties({
    from: provider.getLogs({
      fromBlock: 0,
      toBlock: 'latest',
      topics: [
        id('LOG_JOIN(address,address,uint256)'),
        hexZeroPad(proxyAddress, 32)
      ]
    })
  });
  const poolIds = events.from.map(event => event.address);
  const balances = await getBalances(network, provider, address, poolIds);
  console.log(balances);
  return balances;
}
