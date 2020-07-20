import { ethers } from 'ethers';
import { getAddress, bigNumberify, BigNumber as ethersBN } from 'ethers/utils';
import BigNumber from '@/helpers/bignumber';
import config from '@/helpers/config';
import trustwalletWhitelist from '@/helpers/trustwalletWhitelist.json';

const LS_KEY = 'balancer-pool-management';
export const MAX_GAS = bigNumberify('0xffffffff');
export const MAX_UINT = bigNumberify(ethers.constants.MaxUint256);
export const POOL_TOKENS_DECIMALS = 18;

export const unknownColors = [
  '#6f6776',
  '#9a9a97',
  '#c5ccb8',
  '#c38890',
  '#a593a5',
  '#666092',
  '#9a4f50',
  '#c28d75'
];

export function jsonParse(input, fallback?) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || {};
  }
}

export function shorten(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function bnum(val: string | number | ethersBN | BigNumber): BigNumber {
  return new BigNumber(val.toString());
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val: string | ethersBN | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function denormalizeBalance(
  amount: BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), tokenDecimals);
}

export function normalizeBalance(
  amount: BigNumber,
  tokenDecimals: number
): BigNumber {
  return scale(bnum(amount), -tokenDecimals);
}

export function formatPool(pool) {
  let colorIndex = 0;
  pool.tokens = pool.tokens.map(token => {
    token.checksum = getAddress(token.address);
    token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
    const configToken = config.tokens[token.checksum];
    if (configToken) {
      token.chartColor = configToken.chartColor;
    } else {
      token.chartColor = unknownColors[colorIndex];
      colorIndex++;
    }
    return token;
  });
  if (pool.shares) pool.holders = pool.shares.length;
  pool.tokensList = pool.tokensList.map(token => getAddress(token));
  pool.lastSwapVolume = 0;
  const poolTotalSwapVolume =
    pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume
      ? parseFloat(pool.swaps[0].poolTotalSwapVolume)
      : 0;
  pool.lastSwapVolume = parseFloat(pool.totalSwapVolume) - poolTotalSwapVolume;
  return pool;
}

export async function getMarketChartFromCoinGecko(address) {
  const ratePerDay = {};
  const uri = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart?vs_currency=usd&days=60`;
  try {
    const marketChart = await fetch(uri).then(res => res.json());
    marketChart.prices.forEach(p => {
      const date = new Date();
      date.setTime(p[0]);
      const day = date.toISOString();
      ratePerDay[day] = p[1];
    });
    return ratePerDay;
  } catch (e) {
    return Promise.reject();
  }
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

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

export function trunc(value: number, decimals = 0) {
  const mutiplier = 10 ** decimals;
  return Math.trunc(value * mutiplier) / mutiplier;
}

export function calcPoolTokensByRatio(ratio, totalShares) {
  // @TODO - fix calcs so no buffer is needed
  const buffer = bnum(100);
  return bnum(ratio)
    .times(toWei(totalShares))
    .integerValue(BigNumber.ROUND_DOWN)
    .minus(buffer)
    .toString();
}

export function getTokenLogoUrl(address: string): string | null {
  let trustwalletId: string | null = null;
  if (address === 'ether') {
    trustwalletId = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  } else {
    const checksum = getAddress(address);
    if (checksum === config.addresses.weth) {
      trustwalletId = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    } else if (trustwalletWhitelist.includes(checksum)) {
      trustwalletId = checksum;
    }
  }
  if (!trustwalletId) return null;
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${trustwalletId}/logo.png`;
}

export function etherscanLink(str: string, type = 'address'): string {
  const network = config.network === 'homestead' ? '' : `${config.network}.`;
  return `https://${network}etherscan.io/${type}/${str}`;
}

export function lsSet(key: string, value: any) {
  return localStorage.setItem(`${LS_KEY}.${key}`, JSON.stringify(value));
}

export function lsGet(key: string) {
  const item = localStorage.getItem(`${LS_KEY}.${key}`);
  return jsonParse(item, '');
}

export function lsRemove(key: string) {
  return localStorage.removeItem(`${LS_KEY}.${key}`);
}
