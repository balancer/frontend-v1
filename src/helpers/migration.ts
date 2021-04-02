import config from '@/config';
import { bnum, scale } from './utils';
import { calcPoolOutGivenSingleIn } from './math';

const pools = {
  1: {},
  42: {
    '0x067e961b5278606093746e55bb389bbac2327297':
      '0x09253c3554fb7242608ff67ce048918ccf7f9a96',
    '0x4c05f9535fb4daf21e4a05f5c7b6ee8a363b3ba7':
      '0x947a2a9a044d5135efbe0b04c9e3d7ede767f3a9',
    '0x2352eb4281efee804450a0a9fddf7b6e8d11021d':
      '0x64e1a38a3d49db72df9017a8b9385838453eeab5'
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
