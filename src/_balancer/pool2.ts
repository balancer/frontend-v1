import { multicall } from './utils';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';

const VAULT = '0xBFa16D136bAFEa5a54f581C491be040BA44AF98F';

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
      [VAULT, 'getPoolTokens', [id]]
    ]);
    const addresses = tokenData[0];

    const [balanceData] = await multicall(provider, abi['Vault'], [
      [VAULT, 'getPoolTokenBalances', [id, addresses]]
    ]);
    const balances = balanceData[0].map(balance => balance.toString());

    const [swapFeeData, weightData, totalSupplyData] = await multicall(
      provider,
      abi['WeightedPool'],
      [
        [this.address, 'getSwapFee', []],
        [this.address, 'getWeights', [addresses]],
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
