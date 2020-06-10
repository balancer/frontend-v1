import { Interface, parseEther } from 'ethers/utils';
import { query } from '@/helpers/subgraph';
import provider from '@/helpers/provider';
import { mainnet } from '@/constants.json';
import abi from '@/helpers/abi';
import { bnum } from '@/helpers/utils';

const balancerUri = process.env.VUE_APP_GRAPHQL_HTTP;
const etherKey = 'ether';

export async function getExchangeRatesFromCoinGecko(addresses: string[]) {
  const addressesStr = addresses.join(',');
  const uri = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressesStr}&vs_currencies=usd`;
  return await fetch(uri).then(res => res.json());
}

export async function getPool(address) {
  const ts = Math.round(new Date().getTime() / 1000);
  const tsYesterday = ts - 24 * 3600;
  const q = `
    {
      pool (id: "${address}") {
        id
        publicSwap
        finalized
        swapFee
        totalWeight
        totalShares
        tokensList
        tokens (orderBy: denormWeight, orderDirection: desc) {
          id
          name
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
  `;
  // @ts-ignore
  const { pool } = await query(balancerUri, q);
  return pool;
}

export async function getPools() {
  const ts = Math.round(new Date().getTime() / 1000);
  const tsYesterday = ts - 24 * 3600;
  const q = `
    {
      pools (
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
  `;
  // @ts-ignore
  const { pools } = await query(balancerUri, q);
  return pools;
}

export async function getPoolsWithMarket() {
  const pools = await getPools();
  let tokensAddresses: string[] = [];
  pools.forEach(
    pool => (tokensAddresses = [...tokensAddresses, ...pool.tokensList])
  );
  tokensAddresses = [...new Set(tokensAddresses)];
  const exchangeRates = await getExchangeRatesFromCoinGecko(tokensAddresses);
  return pools
    .map(pool => {
      let marketcap = 0;
      let volume1Day = 0;
      pool.tokens.forEach(token => {
        if (
          !marketcap &&
          exchangeRates[token.address] &&
          exchangeRates[token.address].usd &&
          exchangeRates[token.address].usd > 0
        )
          marketcap =
            ((token.balance * exchangeRates[token.address].usd) /
              token.denormWeight) *
            pool.totalWeight;
      });
      pool.swaps.forEach(swap => {
        if (
          exchangeRates[swap.tokenIn] &&
          exchangeRates[swap.tokenIn].usd &&
          exchangeRates[swap.tokenIn].usd > 0
        )
          volume1Day += swap.tokenAmountIn * exchangeRates[swap.tokenIn].usd;
      });
      return {
        ...pool,
        ...{ marketcap, volume1Day, holders: pool.shares.length }
      };
    })
    .sort((a, b) => b.marketcap - a.marketcap);
}

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
  let { poolShares } = await query(balancerUri, q);
  poolShares = poolShares.map(share => {
    share.poolId.marketcap = 0;
    share.poolId.volume1Day = 0;
    share.poolId.holders = 0;
    return share;
  });
  return poolShares;
}

export async function getBalances(address: string, tokens?: string[]) {
  if (!tokens || !tokens.length)
    tokens = mainnet.tokens.map(token => token.address);
  const promises: Promise<any>[] = [];
  const multi = provider.getContract('Multicall', mainnet.multicall);
  const calls = [];
  const testToken = new Interface(abi.TestToken);
  tokens.forEach(token => {
    if (token !== etherKey) {
      // @ts-ignore
      calls.push([token, testToken.functions.balanceOf.encode([address])]);
    }
  });
  promises.push(multi.aggregate(calls));
  promises.push(multi.getEthBalance(address));
  const balances: any = {};
  try {
    const [[blockNumber, response], ethBalance] = await Promise.all(promises);
    balances.ether = bnum(ethBalance);
    let i = 0;
    response.forEach(value => {
      if (tokens && tokens[i] !== 'ether')
        balances[tokens[i]] = bnum(testToken.functions.balanceOf.decode(value));
      i++;
    });
  } catch (e) {
    console.error(e);
  }
  return balances;
}

export async function joinPool(
  poolAddress: string,
  poolAmountOut: string,
  maxAmountsIn: string[]
) {
  const signer = provider.getSigner();
  const poolContract = provider.getContract('BPool', poolAddress);
  const poolContractWithSigner = poolContract.connect(signer);
  const tx = await poolContractWithSigner.joinPool(
    parseEther(poolAmountOut.toString()),
    maxAmountsIn
  );
  console.log(tx);
  await tx.wait();
}

export async function exitPool(
  poolAddress: string,
  poolAmountIn: string,
  minAmountsOut: string[]
) {
  const signer = provider.getSigner();
  const poolContract = provider.getContract('BPool', poolAddress);
  const poolContractWithSigner = poolContract.connect(signer);
  const tx = await poolContractWithSigner.exitPool(
    parseEther(poolAmountIn),
    minAmountsOut
  );
  console.log(tx);
  await tx.wait();
}
