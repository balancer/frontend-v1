import { calcSpotPrice } from './math';
import { bnum } from './utils';

const reserveCurrencies = {
  1: [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0' // rDAI
  ],
  42: [
    '0x1528F3FCc26d13F7079325Fb78D9442607781c8C', // DAI
    '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5', // USDC
    '0x3183683ceeab01699722053a2cb6a945ce0d7cec' // rDAI
  ]
};

export function swapPrice(pool, chainId, swap) {
  const reserves = new Set(reserveCurrencies[chainId]);
  const poolTokens = new Set(pool.tokensList);

  const intersection = new Set([...poolTokens].filter(x => reserves.has(x)));

  const reserveToken = intersection
    .values()
    .next()
    .value.toLowerCase();

  return swap.tokenIn === reserveToken
    ? swap.tokenAmountIn / swap.tokenAmountOut
    : swap.tokenAmountOut / swap.tokenAmountIn;
}

export function getLbpData(pool, chainId) {
  const reserves = new Set(reserveCurrencies[chainId]);
  const poolTokens = new Set(pool.tokensList);

  let projectToken;
  let projectIdx;
  let reserveIdx;

  // Reserve token is the pool token that IS in reserves
  const intersection = new Set([...poolTokens].filter(x => reserves.has(x)));

  // Project token is the pool token that is NOT in reserves
  const difference = new Set([...poolTokens].filter(x => !reserves.has(x)));

  // An LB Pool has to have two tokens, only one of which is a reserve token
  const lbpPoolFlag = pool.tokensList.length === 2 && intersection.size === 1;
  if (lbpPoolFlag) {
    projectToken = difference.values().next().value;

    if (pool.tokens[0].checksum === projectToken) {
      projectIdx = 0;
      reserveIdx = 1;
    } else {
      projectIdx = 1;
      reserveIdx = 0;
    }
  }

  return {
    // There are two tokens and (only) one of them is a reserve currency
    // We want the price of the pool token in terms of the reserve
    // tokenIn is reserve; token out is project
    isLbpPool: lbpPoolFlag,
    lbpPrice: calcSpotPrice(
      bnum(pool.tokens[reserveIdx].balance),
      bnum(pool.tokens[reserveIdx].denormWeight),
      bnum(pool.tokens[projectIdx].balance),
      bnum(pool.tokens[projectIdx].denormWeight),
      bnum(pool.swapFee * 1e18)
    ).div(1e18),
    projectToken: pool.tokens[projectIdx].symbol
  };
}
