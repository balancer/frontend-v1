import config from '@/config';
import { bnum, scale } from './utils';
import { calcExactTokensInForBPTOut } from './math';

const pools = {
  1: {
    '0x59a19d8c652fa0284f44113d0ff9aba70bd46fb4':
      '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df',
    '0x1eff8af5d577060ba4ac8a29a13525bb0ee2a3d5':
      '0x0297e37f1873d2dab4487aa67cd56b58e2f27875',
    '0x221bf20c2ad9e5d7ec8a9d1991d8e2edcfcb9d6c':
      '0x0297e37f1873d2dab4487aa67cd56b58e2f27875'
  },
  42: {
    '0xf422508eed1ab40923dd45ff8027a9dda6655d10':
      '0x61d5dc44849c9c87b0856a2a311536205c96c7fd',
    '0xf3ffac7b8e3adf1961edb694e057029749a2e847':
      '0x61d5dc44849c9c87b0856a2a311536205c96c7fd',
    '0xf72bb38b0fd36286b813db509bf6adacb75b8bfc':
      '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df',
    '0x1d50bdffbcb2bf8af6411c691f953eef63a38ecc':
      '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df'
  }
};

const SLIPPAGE_BUFFER = 0.02; // 2%

function calculateJoinPoolAmount(amounts: string[], poolData) {
  const balances = poolData.tokens.map(token => bnum(token.balance));
  const totalWeight = poolData.tokens.reduce((totalWeight, token) => {
    return totalWeight.plus(token.denormWeight);
  }, bnum(0));
  const normalizedWeights = poolData.tokens.map(token => {
    const weight = bnum(token.denormWeight);
    const normalizedWeight = weight.div(totalWeight);
    return normalizedWeight;
  });
  const amountsIn = amounts.map(amount => bnum(amount));
  const totalSupply = bnum(poolData.totalSupply);
  const swapFee = scale(bnum(poolData.swapFee), 18);
  return calcExactTokensInForBPTOut(
    balances,
    normalizedWeights,
    amountsIn,
    totalSupply,
    swapFee
  );
}

export function getNewPool(address: string) {
  return pools[config.chainId][address.toLowerCase()];
}

export function calculateMinAmount(
  isFullMigration,
  poolV1Amount: string,
  poolV1Data,
  poolV2Data
) {
  if (poolV2Data.tokens.length > 2) {
    return '0';
  }
  // TODO return 0 if v1 tokens in not superset of v2

  const fullAmountsIn = poolV2Data.tokens.map(token => {
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
  const amountRatios = poolV2Data.tokens.map((token, index) => {
    const fullAmountIn = fullAmountsIn[index];
    const amountRatio = bnum(fullAmountIn).div(token.balance);
    return amountRatio;
  });
  const minAmountRatio = amountRatios.reduce((minRatio, ratio) =>
    minRatio.lt(ratio) ? minRatio : ratio
  );
  const propAmountsIn = fullAmountsIn.map((amount, index) => {
    const token = poolV2Data.tokens[index];
    return minAmountRatio.times(token.balance);
  });
  const amountsIn = isFullMigration ? fullAmountsIn : propAmountsIn;
  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);
  const minAmount = poolV2Amount.times(1 - SLIPPAGE_BUFFER);
  return minAmount.toFixed(0);
}

export function calculatePriceImpact(
  poolV1Amount: string,
  poolV1Data,
  poolV2Data
) {
  if (poolV2Data.tokens.length > 2) {
    return 1;
  }
  // TODO return 1 if v1 tokens in not superset of v2

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

  const v1Tokens = poolV1Data.tokens;
  const v2Tokens = poolV2Data.tokens;

  const v1TotalWeight = poolV1Data.tokens.reduce(
    (totalWeight, token) => totalWeight.plus(token.denormWeight),
    bnum(0)
  );
  const v2TotalWeight = poolV2Data.tokens.reduce(
    (totalWeight, token) => totalWeight.plus(token.denormWeight),
    bnum(0)
  );

  const baseTokenAddress = v2Tokens[0].address;
  const v1BaseToken = v1Tokens.find(
    token => token.address === baseTokenAddress.toLowerCase()
  );
  const v1BaseTokenBalanceRaw = bnum(v1BaseToken.balance);
  const v1BaseTokenBalance = scale(v1BaseTokenBalanceRaw, v1BaseToken.decimals);
  const v1Liquidity = v1BaseTokenBalance
    .div(v1BaseToken.denormWeight)
    .times(v1TotalWeight);
  const v2BaseToken = v2Tokens.find(
    token => token.address === baseTokenAddress
  );
  const v2BaseTokenBalance = bnum(v2BaseToken.balance);
  const v2Liquidity = v2BaseTokenBalance
    .div(v2BaseToken.denormWeight)
    .times(v2TotalWeight);

  const quoteTokenAddress = v2Tokens[1].address;
  const v1QuoteToken = v1Tokens.find(
    token => token.address === quoteTokenAddress.toLowerCase()
  );
  const v2QuoteToken = v2Tokens.find(
    token => token.address === quoteTokenAddress
  );

  const v1Price = bnum(v1BaseToken.balance)
    .times(v1QuoteToken.denormWeight)
    .div(v1QuoteToken.balance)
    .div(v1BaseToken.denormWeight);
  const v2Price = bnum(v2BaseToken.balance)
    .times(v2QuoteToken.denormWeight)
    .div(v2QuoteToken.balance)
    .div(v2BaseToken.denormWeight);

  const marketPrice = v1Liquidity.gt(v2Liquidity.times(0.1))
    ? v1Price
    : v2Price;

  const priceRatio = marketPrice.div(v2Price);
  const baseBalanceAdjusted = bnum(v2BaseToken.balance).times(
    priceRatio.pow(
      bnum(v2QuoteToken.denormWeight)
        .div(v2TotalWeight)
        .times(10)
        .toFixed(0)
    )
  );
  const quoteBalanceAdjusted = bnum(v2QuoteToken.balance).times(
    priceRatio.pow(
      bnum(v2BaseToken.denormWeight)
        .negated()
        .div(v2TotalWeight)
        .times(10)
        .toFixed(0)
    )
  );

  const baseAssetPrice = baseBalanceAdjusted
    .times(v2TotalWeight)
    .div(v2BaseToken.denormWeight)
    .div(poolV2Data.totalSupply);
  const quoteAssetPrice = quoteBalanceAdjusted
    .times(v2TotalWeight)
    .div(v2QuoteToken.denormWeight)
    .div(poolV2Data.totalSupply);

  const baseAmounIn = bnum(amountsIn[0]);
  const quoteAmounIn = bnum(amountsIn[1]);

  const poolV2AmountSpot = baseAmounIn
    .div(baseAssetPrice)
    .plus(quoteAmounIn.div(quoteAssetPrice));

  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);

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
      amount: amount.toFixed(4)
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
          amount: leftoverAmount.toFixed(4)
        };
      })
      .filter(tokenAmount => parseFloat(tokenAmount.amount) > 0.0000001);
  }
}
