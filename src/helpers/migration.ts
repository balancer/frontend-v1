import config from '@/config';
import { bnum, scale } from './utils';
import { calcPoolOutGivenSingleIn } from './math';

const pools = {
  1: {},
  42: {
    '0x208a560d57e25c74b4052c9bad253bbaf507f126':
      '0x058f87179e8d6c00185921b535645b579e087075',
    '0x9302470b18a65d0073e08c79345d8312e2fbe253':
      '0x6f9a36e4735787f9f04961513898a438b9c9a647',
    '0x4818c9ae4560fc940f39eaf7c1c11dff11570e38':
      '0xfaf73fa9b641700a4cdb16ee50e06b9c49e30c00',
    '0x6ed4d414307fbd1aa058be7b87f5df95aa1cdfaf':
      '0x6b2dc12699f66d571481bb1fbcfbdb74e2604135',
    '0x1492b5b01350b7c867185a643f2e59f7be279fd3':
      '0x2e74033d5d2b437412f5026e97a918955e185fa6'
  }
};

function calculateJoinPoolAmount(amountsIn: string[], poolData) {
  const poolSupply = bnum(poolData.totalSupply);
  const totalWeight = poolData.tokens.reduce((totalWeight, token) => {
    return totalWeight.plus(token.denormWeight);
  }, bnum(0));
  const swapFee = bnum(poolData.swapFee);
  const totalAmount = amountsIn.reduce((acc, amount, index) => {
    const tokenBalanceIn = bnum(poolData.tokens[index].balance);
    const tokenWeightIn = bnum(poolData.tokens[index].denormWeight);
    const tokenAmountIn = bnum(amount);
    const singleInAmount = calcPoolOutGivenSingleIn(
      tokenBalanceIn,
      tokenWeightIn,
      poolSupply,
      totalWeight,
      tokenAmountIn,
      swapFee
    );
    return acc.plus(singleInAmount);
  }, bnum(0));
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
    const shortBalanceNumber = bnum(tokenIn.balance);
    const decimals = tokenIn.decimals;
    const balanceNumber = scale(shortBalanceNumber, decimals);
    const totalSharesNumber = bnum(poolV1Data.totalShares);
    const totalSupplyNumber = scale(totalSharesNumber, 18);
    const amountNumber = balanceNumber
      .times(poolV1Amount)
      .div(totalSupplyNumber);
    return amountNumber.toString();
  });

  const totalWeight = poolV2Data.tokens.reduce((totalWeight, token) => {
    return totalWeight.plus(token.denormWeight);
  }, bnum(0));
  const prices = poolV2Data.tokens.map(token => {
    const denormWeight = bnum(token.denormWeight);
    const weight = denormWeight.div(totalWeight);
    const balance = bnum(token.balance);
    const priceNumber = balance.div(weight).div(poolV2Data.totalSupply);
    return priceNumber.toString();
  });

  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);

  let poolV2AmountSpot = bnum(0);
  for (let i = 0; i < poolV2Data.tokens.length; i++) {
    const amountNumber = bnum(amountsIn[i]);
    poolV2AmountSpot = poolV2AmountSpot.plus(amountNumber.div(prices[i]));
  }

  const one = bnum(1);
  const priceImpact = one.minus(poolV2Amount.div(poolV2AmountSpot));

  return priceImpact.toNumber();
}

export function getLeftoverAssets(
  poolV1Amount: string,
  poolV1Data,
  poolV2Data,
  isFullMigration: boolean
) {
  const v1Tokens = poolV1Data.tokens;
  const v2Tokens = poolV2Data.tokens;

  const missingAssets: string[] = [];
  for (const v1Token of v1Tokens) {
    const v2Token = v2Tokens.find(
      v2Token => v1Token.address === v2Token.address.toLowerCase()
    );
    if (!v2Token) {
      missingAssets.push(v1Token.address);
    }
  }

  const amountNumber = bnum(poolV1Amount);
  const totalSharesShort = bnum(poolV1Data.totalShares);
  const totalShares = scale(totalSharesShort, 18);
  const share = amountNumber.div(totalShares);
  const tokenAmounts = v1Tokens.map(token => {
    const amount = share.times(token.balance);
    return {
      address: token.address,
      amount: amount.toFixed(6)
    };
  });

  if (isFullMigration) {
    if (missingAssets.length === 0) {
      return [];
    } else {
      // Return missing asset
      return tokenAmounts.filter(tokenAmount =>
        missingAssets.includes(tokenAmount.address)
      );
    }
  } else {
    let lowestRatio = bnum(1);
    for (const token of v2Tokens) {
      const tokenAmount = tokenAmounts.find(
        amount => token.address.toLowerCase() === amount.address
      ).amount;
      const tokenDecimal = v1Tokens.find(
        v1Token => v1Token.address === token.address.toLowerCase()
      ).decimals;
      const tokenBalance = scale(bnum(token.balance), -tokenDecimal);
      const ratio = bnum(tokenAmount).div(tokenBalance);
      if (ratio.lt(lowestRatio)) {
        lowestRatio = ratio;
      }
    }
    const tokenInAmounts = v2Tokens.map(token => {
      const tokenDecimal = v1Tokens.find(
        v1Token => v1Token.address === token.address.toLowerCase()
      ).decimals;
      const tokenBalance = scale(bnum(token.balance), -tokenDecimal);
      const amount = lowestRatio.times(tokenBalance);
      return {
        address: token.address.toLowerCase(),
        amount
      };
    });

    return tokenAmounts
      .map(tokenAmount => {
        const tokenIn = tokenInAmounts.find(
          tokenInAmount => tokenInAmount.address === tokenAmount.address
        );
        const tokenInAmount = tokenIn ? tokenIn.amount : 0;
        const tokenAmountNumber = bnum(tokenAmount.amount);
        const leftoverAmount = tokenAmountNumber.minus(tokenInAmount);
        return {
          address: tokenAmount.address,
          amount: leftoverAmount.toFixed(6)
        };
      })
      .filter(
        tokenAmount => parseFloat(tokenAmount.amount) > 0.000000000000000001
      );
  }
}
