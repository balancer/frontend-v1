import merge from 'lodash/merge';
import { getAddress } from '@ethersproject/address';
import { multicall, subgraphRequest } from '@bonustrack/snapshot.js/src/utils';
import provider from '@/helpers/rpc';
import abi from '@/helpers/abi';
import { formatPool } from '@/helpers/utils';
import { formatUnits } from '@ethersproject/units';
import queries from '@/helpers/queries.json';

const subgraphUrl = process.env.VUE_APP_SUBGRAPH_URL;

export default class Pool {
  public readonly address: string;
  public readonly checksum: string;
  public metadata?: any;

  constructor(address: string) {
    this.address = address.toLowerCase();
    this.checksum = getAddress(address);
  }

  async getMetadata() {
    this.metadata = await this.getSubgraphMetadata();
    const metadata = await this.getNodeMetadata();
    this.metadata = { ...this.metadata, ...metadata };
    return this.metadata;
  }

  async getNodeMetadata() {
    const address = this.metadata.crp ? this.metadata.controller : this.address;
    const [publicSwap, name, decimals, symbol, totalShares] = await multicall(
      provider,
      abi['BPool'],
      [
        'isPublicSwap',
        'name',
        'decimals',
        'symbol',
        'totalSupply'
      ].map(method => [address, method, []])
    );
    return {
      publicSwap: publicSwap[0],
      name: name.toString(),
      symbol: symbol.toString(),
      totalShares: formatUnits(totalShares.toString(), decimals)
    };
  }

  async getSubgraphMetadata() {
    const swapTsStart = Math.round(new Date().getTime() / 1000) - 24 * 3600;
    const query = {
      pool: {
        __args: {
          id: this.address
        },
        swaps: {
          __args: {
            where: {
              timestamp_lt: swapTsStart
            }
          }
        }
      }
    };
    try {
      const response = await subgraphRequest(
        subgraphUrl,
        merge(queries['getPool'], query)
      );
      return formatPool(response.pool);
    } catch (e) {
      console.error(e);
    }
  }
}
