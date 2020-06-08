import { query } from '@/helpers/subgraph';

const balancerUri = process.env.VUE_APP_GRAPHQL_HTTP;

export async function getExchangeRatesFromCoinGecko(addresses) {
  const addressesStr = addresses.join(',');
  const uri = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressesStr}&vs_currencies=usd`;
  return await fetch(uri).then(res => res.json());
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
