import { formatEther, Interface } from 'ethers/utils';
import { query } from '@/helpers/subgraph';
import provider from '@/helpers/provider';
import config from '@/helpers/config';
import abi from '@/helpers/abi';

export async function getSharesOwned(address: string) {
  const ts = Math.round(new Date().getTime() / 1000);
  const tsYesterday = ts - 24 * 3600;
  const q = `
    {
      poolShares (where: { userAddress: "${address.toLowerCase()}" }) {
        balance
        poolId (
          first: 1000, 
          where: { tokensList_not: [] },
          orderBy: joinsCount, 
          orderDirection: desc
        ) {
          id
          publicSwap
          finalized
          swapFee
          totalWeight
          totalShares
          tokensList
          tokens (orderBy: denormWeight, orderDirection: desc) {
            id
            address
            balance
            decimals
            symbol
            denormWeight
          }
          shares (where: { balance_gt: 0 }) {
            id
            poolId {
              id
            }
            userAddress {
              id
            }
            balance
          }
          swaps (where: { timestamp_gt: ${tsYesterday} }) {
            tokenIn
            tokenInSym
            tokenAmountIn
            tokenOut
            tokenOutSym
            tokenAmountOut
          }
        }
      }
    }
  `;
  // @ts-ignore
  let { poolShares } = await query(config.subgraphUrl, q);
  poolShares = poolShares.map(share => {
    share.poolId.marketcap = 0;
    share.poolId.volume1Day = 0;
    share.poolId.holders = 0;
    return share;
  });
  return poolShares;
}

export async function getBalances(address: string, tokens?: string[]) {
  if (!tokens || !tokens.length) {
    // @ts-ignore
    tokens = Object.entries(config.tokens).map(token => token[1].address);
  }
  const promises: Promise<any>[] = [];
  const multi = provider.getContract('Multicall', config.addresses.multicall);
  const calls = [];
  const testToken = new Interface(abi.TestToken);
  tokens.forEach(token => {
    // @ts-ignore
    calls.push([token, testToken.functions.balanceOf.encode([address])]);
  });
  promises.push(multi.aggregate(calls));
  promises.push(multi.getEthBalance(address));
  const balances: any = {};
  try {
    const [[, response], ethBalance] = await Promise.all(promises);
    balances.ether = parseFloat(formatEther(ethBalance));
    let i = 0;
    response.forEach(value => {
      if (tokens && tokens[i]) {
        const tokenBalance = testToken.functions.balanceOf.decode(value);
        balances[tokens[i]] = parseFloat(formatEther(tokenBalance.toString()));
      }
      i++;
    });
  } catch (e) {
    console.error(e);
  }
  return balances;
}

export async function proxies(address: string) {
  const dsProxyRegistryContract = provider.getContract(
    'DSProxyRegistry',
    config.addresses.dsProxyRegistry
  );
  return await dsProxyRegistryContract.proxies(address);
}
