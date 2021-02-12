import { multicall } from './utils';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';
import config from '@/config';

export default class PoolV2 {
  public readonly address: string;

  constructor(address: string) {
    this.address = address.toLowerCase();
  }

  async getMetadata() {
    const [idData] = await multicall(provider, abi['WeightedPool'], [
      [this.address, 'getPoolId', []]
    ]);
    const id = idData[0];

    const [tokenData] = await multicall(provider, abi['Vault'], [
      [config.addresses.vault, 'getPoolTokens', [id]]
    ]);
    const addresses = tokenData[0];
    const balances = tokenData[1].map(balance => balance.toString());

    const [swapFeeData, weightData, totalSupplyData] = await multicall(
      provider,
      abi['WeightedPool'],
      [
        [this.address, 'getSwapFee', []],
        [this.address, 'getNormalizedWeights', [addresses]],
        [this.address, 'totalSupply', []]
      ]
    );
    const swapFee = swapFeeData[0].toString();
    const weights = weightData[0].map(weight => weight.toString());
    const totalSupply = totalSupplyData[0].toString();

    const tokens = addresses.map((address, index) => {
      return {
        address,
        denormWeight: weights[index],
        balance: balances[index]
      };
    });

    return {
      tokens,
      swapFee,
      totalSupply
    };
  }
}
