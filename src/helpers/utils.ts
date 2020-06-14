import { ethers, utils } from 'ethers';
import BigNumber from '@/helpers/bignumber';

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

export function formatCurrency(balance: BigNumber): string {
  const fmt = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3
  };
  return balance.toFormat(2, BigNumber.ROUND_DOWN, fmt);
}

export function formatPercentage(
  value: BigNumber,
  decimals: number,
  useLowerLimit = true
): string {
  if (value.lte(0.0001) && value.gt(0) && useLowerLimit) return '<0.01%';
  return `${value.times(100).toFormat(decimals, BigNumber.ROUND_DOWN)}%`;
}

export const padToDecimalPlaces = (
  value: string,
  minDecimals: number
): string => {
  const split = value.split('.');
  const zerosToPad = split[1] ? minDecimals - split[1].length : minDecimals;
  if (zerosToPad > 0) {
    let pad = '';
    // Add decimal point if no decimal portion in original number
    if (zerosToPad === minDecimals) pad += '.';
    for (let i = 0; i < zerosToPad; i++) pad += '0';
    return value + pad;
  }
  return value;
};

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val: string | utils.BigNumber | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function formatBalance(
  balance: BigNumber,
  decimals: number,
  precision: number
): string {
  if (balance.eq(0)) return bnum(0).toFixed(2);
  const result = scale(balance, -decimals)
    .decimalPlaces(precision, BigNumber.ROUND_DOWN)
    .toString();
  return padToDecimalPlaces(result, 2);
}

export function denormalizeBalance(
  amount: BigNumber,
  tokenAddress: string
): BigNumber {
  return scale(
    bnum(amount),
    18 // @TODO change to asset decimals
  );
}

export function formatPool(pool) {
  pool.swapFeePercent = pool.swapFee * 100;
  pool.holders = pool.shares.length;
  pool.tokens = pool.tokens.map(token => {
    token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
    return token;
  });
  return pool;
}
