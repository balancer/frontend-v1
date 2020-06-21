import { query } from '@/helpers/subgraph';
import provider from '@/helpers/provider';
import config from '@/helpers/config';

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

export async function proxies(address: string) {
  const dsProxyRegistryContract = provider.getContract(
    'DSProxyRegistry',
    config.addresses.dsProxyRegistry
  );
  return await dsProxyRegistryContract.proxies(address);
}
