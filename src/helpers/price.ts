import BigNumber from './bignumber';

export function getPoolLiquidity(pool, prices) {
  let sumWeight = new BigNumber(0);
  let sumValue = new BigNumber(0);
  for (const token of pool.tokens) {
    const price = prices[token.checksum];
    if (!price) {
      continue;
    }
    const balanceNumber = new BigNumber(token.balance);
    const value = balanceNumber.times(price);
    sumValue = sumValue.plus(value);
    sumWeight = sumWeight.plus(token.weightPercent / 100);
  }
  if (sumWeight.gt(0)) {
    return sumValue.div(sumWeight).toString();
  } else {
    return pool.liquidity;
  }
}
