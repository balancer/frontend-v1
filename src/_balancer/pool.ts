import merge from 'lodash/merge';
import { getAddress, isAddress } from '@ethersproject/address';
import { multicall, subgraphRequest } from './utils';
import provider from '@/helpers/rpc';
import abi from '@/helpers/abi';
import { poolRights, formatPool } from '@/helpers/utils';
import { formatUnits } from '@ethersproject/units';
import queries from '@/helpers/queries.json';
import config from '@/config';

const subgraphUrl = process.env.VUE_APP_SUBGRAPH_URL;

export default class Pool {
  public readonly address: string;
  public readonly checksum: string;
  public ready = false;
  public metadata?: any;

  constructor(address: string) {
    this.address = address.toLowerCase();
    this.checksum = isAddress(address) ? getAddress(address) : '';
  }

  isWhitelisted() {
    return !!config.crps[this.address];
  }

  getTypeStr() {
    return this.metadata.finalized
      ? 'Shared'
      : this.isCrp()
      ? 'Smart pool'
      : 'Private';
  }

  getAbout() {
    return this.isWhitelisted() && config.crps[this.address].about
      ? config.crps[this.address].about
      : '';
  }

  isCrp() {
    if (this.isWhitelisted()) return true;
    return this.metadata.crp;
  }

  getBptAddress() {
    return this.isCrp() ? this.metadata.controller : this.address;
  }

  async getMetadata() {
    try {
      this.metadata = await this.getSubgraphMetadata();
      const metadata = await this.getNodeMetadata();
      this.metadata = { ...this.metadata, ...metadata };
      this.ready = true;
      return this.metadata;
    } catch (e) {
      return Promise.reject();
    }
  }

  async getNodeMetadata() {
    const address = this.getBptAddress();
    if (this.isCrp()) {
      const [
        publicSwap,
        name,
        decimals,
        symbol,
        totalShares,
        rights,
        bspCap
      ] = await multicall(
        provider,
        abi['ConfigurableRightsPool'],
        [
          'isPublicSwap',
          'name',
          'decimals',
          'symbol',
          'totalSupply',
          'rights',
          'bspCap'
        ].map(method => [address, method, []])
      );
      return {
        publicSwap: publicSwap[0],
        name: name.toString(),
        symbol: symbol.toString(),
        totalShares: formatUnits(totalShares.toString(), decimals),
        rights: Object.fromEntries(
          Object.entries(poolRights).map((right, i) => [right[0], rights[i]])
        ),
        bspCap: formatUnits(bspCap.toString(), decimals)
      };
    }
    const [
      publicSwap,
      name,
      decimals,
      symbol,
      swapFee,
      totalShares
    ] = await multicall(
      provider,
      abi['BPool'],
      [
        'isPublicSwap',
        'name',
        'decimals',
        'symbol',
        'getSwapFee',
        'totalSupply'
      ].map(method => [address, method, []])
    );
    return {
      publicSwap: publicSwap[0],
      name: name.toString(),
      symbol: symbol.toString(),
      swapFee: formatUnits(swapFee.toString(), decimals),
      totalShares: formatUnits(totalShares.toString(), decimals),
      rights: [],
      bspCap: 0
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
