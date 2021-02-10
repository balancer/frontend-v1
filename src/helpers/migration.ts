import config from '@/config';
import BigNumber from './bignumber';
import { scale } from './utils';
import { calcPoolOutGivenSingleIn } from './math';

const pools = {
  1: {},
  42: {
    '0x208a560d57e25c74b4052c9bad253bbaf507f126':
      '0x369F6F4116813e3e3F79faBE3444a7c41e716f8f',
    '0x9302470b18a65d0073e08c79345d8312e2fbe253':
      '0xb7379b285fa51258ce0a7e31be7e3c311daf99ee',
    '0x1492b5b01350b7c867185a643f2e59f7be279fd3':
      '0xf803f6cd078c277f821a86e03b091e982b510082'
  }
};

function calculateJoinPoolAmount(amountsIn: string[], poolData) {
  const poolSupply = new BigNumber(poolData.totalSupply);
  const totalWeight = poolData.tokens.reduce((totalWeight, token) => {
    return totalWeight.plus(token.denormWeight);
  }, new BigNumber(0));
  const swapFee = new BigNumber(poolData.swapFee);
  const totalAmount = amountsIn.reduce((acc, amount, index) => {
    const tokenBalanceIn = new BigNumber(poolData.tokens[index].balance);
    const tokenWeightIn = new BigNumber(poolData.tokens[index].denormWeight);
    const tokenAmountIn = new BigNumber(amount);
    const singleInAmount = calcPoolOutGivenSingleIn(
      tokenBalanceIn,
      tokenWeightIn,
      poolSupply,
      totalWeight,
      tokenAmountIn,
      swapFee
    );
    return acc.plus(singleInAmount);
  }, new BigNumber(0));
  return totalAmount;
}

export function getNewPool(address: string) {
  return pools[config.chainId][address.toLowerCase()];
}

export function calculatePriceImpact(
  poolV1Amount: string,
  poolV1Data,
  poolV2Data
) {
  const amountsIn = poolV2Data.tokens.map(token => {
    const tokenIn = poolV1Data.tokens.find(
      t => t.address === token.address.toLowerCase()
    );
    const shortBalanceNumber = new BigNumber(tokenIn.balance);
    const decimals = tokenIn.decimals;
    const balanceNumber = scale(shortBalanceNumber, decimals);
    const totalSharesNumber = new BigNumber(poolV1Data.totalShares);
    const totalSupplyNumber = scale(totalSharesNumber, 18);
    const amountNumber = balanceNumber
      .times(poolV1Amount)
      .div(totalSupplyNumber);
    return amountNumber.toString();
  });

  const totalWeight = poolV2Data.tokens.reduce((totalWeight, token) => {
    return totalWeight.plus(token.denormWeight);
  }, new BigNumber(0));
  const prices = poolV2Data.tokens.map(token => {
    const denormWeight = new BigNumber(token.denormWeight);
    const weight = denormWeight.div(totalWeight);
    const balance = new BigNumber(token.balance);
    const priceNumber = balance.div(weight).div(poolV2Data.totalSupply);
    return priceNumber.toString();
  });

  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);

  let poolV2AmountSpot = new BigNumber(0);
  for (let i = 0; i < poolV2Data.tokens.length; i++) {
    const amountNumber = new BigNumber(amountsIn[i]);
    poolV2AmountSpot = poolV2AmountSpot.plus(amountNumber.div(prices[i]));
  }

  const one = new BigNumber(1);
  const priceImpact = one.minus(poolV2Amount.div(poolV2AmountSpot));

  return priceImpact.toNumber();
}
