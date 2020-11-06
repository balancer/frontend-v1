// pokeWeights can get "stuck" if the total denorm is at the core pool MAX of 50
// To avoid this, limit the max to 25 for smart pools with canChangeWeights enabled
// This lowers the resolution from 98%/2% to 96%/4%, but prevents contracts from locking up
export function getMaxTotalWeight(isSharedOrLockedSmartPool) {
  return isSharedOrLockedSmartPool ? 50 : 25;
}

// Allow entry of *any* positive number for a weight
// Convert to percentages first... then convert to denorms by dividing by the resolution
// This factor will be 2 for max 50 pools (2%-98%, 1-49) and 4 for max 25 pools (4%-96%, 1-24)
export function getDivisor(isSharedOrLockedSmartPool) {
  return 100 / getMaxTotalWeight(isSharedOrLockedSmartPool);
}

// Minimium individual weight percentage will be the divisor (2% or 4%)
// Maximum individual weight percentage will be 100 minus this (98% or 96%)
export function getMaxPercentage(isSharedOrLockedSmartPool) {
  return 100 - getDivisor(isSharedOrLockedSmartPool);
}

// Convert to a denorm value; divide the percentage by the resolution
// 50% with resolution 2 is 25; 50% with resolution 4 is 12.5
export function getDenorm(percentage, isSharedOrLockedSmartPool) {
  return percentage / getDivisor(isSharedOrLockedSmartPool);
}

export function isValidDenormValue(denorm) {
  return denorm >= 1 && denorm <= 49;
}
