import { ethers, utils } from 'ethers';
import BigNumber from '@/helpers/bignumber';
import config from '@/helpers/config';
import { getAddress } from 'ethers/utils';

export const MAX_GAS = utils.bigNumberify('0xffffffff');
export const MAX_UINT = utils.bigNumberify(ethers.constants.MaxUint256);
export const POOL_TOKENS_DECIMALS = 18;

export function shorten(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function bnum(
  val: string | number | utils.BigNumber | BigNumber
): BigNumber {
  return new BigNumber(val.toString());
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val: string | utils.BigNumber | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function denormalizeBalance(
  amount: BigNumber,
  tokenAddress: string
): BigNumber {
  const token = config.tokens[tokenAddress];
  return scale(bnum(amount), token.decimals);
}

export function formatPool(pool) {
  pool.tokens = pool.tokens.map(token => {
    token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
    return token;
  });
  pool.swapFeePercent = pool.swapFee * 100;
  pool.holders = pool.shares.length;
  pool.totalVolume1Day = pool.swaps.reduce((a, b) => {
    const tokenOut = pool.tokens.find(token => token.address === b.tokenOut);
    const tokenOutValue =
      (((parseFloat(pool.totalEthValue) / 100) * tokenOut.weightPercent) /
        parseFloat(tokenOut.balance)) *
      parseFloat(b.tokenAmountOut);
    return a + tokenOutValue;
  }, 0);
  return pool;
}

export async function getMarketChartFromCoinGecko(address) {
  const ratePerDay = {};
  const uri = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart?vs_currency=usd&days=60`;
  const marketChart = await fetch(uri).then(res => res.json());
  marketChart.prices.forEach(p => {
    const date = new Date();
    date.setTime(p[0]);
    const day = date.toISOString();
    ratePerDay[day] = p[1];
  });
  return ratePerDay;
}

export function isValidAddress(str) {
  try {
    getAddress(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
