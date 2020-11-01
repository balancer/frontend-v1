export function getMaxTotalWeight(isSharedOrLockedSmartPool) {
  return isSharedOrLockedSmartPool ? 50 : 25;
}

// Could be 1/49 or total up to 50 (if legacy)
// Need to transform to 1-24. Could lose resolution/not match exactly
// For instance, if they came in 49/1 (98/2%), we'd map to 24/1 (96/4%)
//
// tokens: array of token objects (with weights)
// isSharedOrLockedSmartPool: boolean; restrict for safety if smart pool with changeable weights
// returnDenorm: boolean; return either denorm values if true; else return percentages
export function calculateNewWeights(
  tokens,
  isSharedOrLockedSmartPool,
  returnDenorm
) {
  const originalWeights = new Array(tokens.length);
  const finalWeights = new Array(tokens.length);
  const maxTotal = getMaxTotalWeight(isSharedOrLockedSmartPool);
  const multiplier = 100 / maxTotal;
  let totalWeight = 0;
  let idx;

  for (idx = 0; idx < tokens.length; idx++) {
    originalWeights[idx] = parseFloat(tokens[idx].denormWeight);
    totalWeight += parseFloat(tokens[idx].denormWeight);
  }
  console.log(originalWeights);
  console.log(totalWeight);

  // If we want to return denorm weights, divide by the multiplier
  // Otherwise just return the percentages
  const divisor = returnDenorm ? multiplier : 1;

  for (idx = 0; idx < tokens.length; idx++) {
    // Rescale to new limits
    // If original is 49/50, that's 98%
    // If original is 1/50, that's 2%
    // New denorm is MAX(4, MIN(w, 96)) / 4
    //   figure out the percentage it has to be, then the correct denorm for that %
    // So 98% is MAX(4,MIN(98,96)) = 96 / 4 = 24; weights go 49 -> 24
    // And 2% is MAX(4,MIN(4,96)) = 4 / 4 = 1; weights go from 1 -> 1 (no value change, but 2% to 4%)
    finalWeights[idx] =
      Math.max(
        multiplier,
        Math.min(
          (originalWeights[idx] / totalWeight) * 100,
          maxTotal * multiplier
        )
      ) / divisor;
  }

  return finalWeights;
}

export function calculateNewWeightsObj(
  tokens,
  isSharedOrLockedSmartPool,
  returnDenorm
) {
  const result = calculateNewWeights(
    tokens,
    isSharedOrLockedSmartPool,
    returnDenorm
  );
  const obj = {};

  for (let idx = 0; idx < tokens.length; idx++) {
    obj[tokens.checksum] = result[idx];
  }

  return obj;
}
