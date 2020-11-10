import Big from '@/helpers/bignumber';
import { multicall } from '@snapshot-labs/snapshot.js/src/utils';
import abi from '@/helpers/abi';
import config from '@/config';
import { unknownColors } from '@/helpers/utils';

function groupResult(groupCalls, result) {
  return Object.fromEntries(
    Object.entries(groupCalls).map(([key, groupCall]) => [
      key,
      Object.fromEntries(
        // @ts-ignore
        groupCall.map(call => {
          const [value] = result[call.id];
          return [call.name, value];
        })
      )
    ])
  );
}

function ungroupCalls(groupCalls) {
  // @ts-ignore
  return Object.values(groupCalls)
    .reduce((a: any, b) => a.concat(b))
    .map(call => call.call);
}

export async function getPools(network, provider, poolIds) {
  let i = 0;
  let groupCalls = Object.fromEntries(
    poolIds.map(poolId => [
      poolId,
      [
        ['controller', 'getController'],
        ['totalDenormWeight', 'getTotalDenormalizedWeight'],
        ['tokensList', 'getCurrentTokens'],
        ['finalized', 'isFinalized'],
        ['publicSwap', 'isPublicSwap'],
        ['swapFee', 'getSwapFee'],
        ['totalSupply', 'totalSupply']
      ].map(call => {
        i++;
        return {
          id: i - 1,
          name: call[0],
          call: [poolId, call[1], call[2]]
        };
      })
    ])
  );
  let result = await multicall(
    network.toString(),
    provider,
    abi['BPool'],
    ungroupCalls(groupCalls)
  );
  let pools = groupResult(groupCalls, result);

  i = 0;
  groupCalls = Object.fromEntries(
    Object.entries(pools)
      .map(pool => pool[1].tokensList.map(poolToken => [pool[0], poolToken]))
      .reduce((a, b) => a.concat(b))
      .map(([poolId, poolToken]) => [
        `${poolId}-${poolToken}`,
        [
          ['name', 'name'],
          ['decimals', 'decimals'],
          ['symbol', 'symbol'],
          ['totalSupply', 'totalSupply'],
          ['balance', 'balanceOf', [poolId]],
          ['denormWeight', 'getDenormalizedWeight', [poolToken]]
        ].map(call => {
          i++;
          const address = call[0] === 'denormWeight' ? poolId : poolToken;
          return {
            id: i - 1,
            name: call[0],
            call: [address, call[1], call[2]]
          };
        })
      ])
  );
  result = await multicall(
    network.toString(),
    provider,
    abi['BPool'],
    ungroupCalls(groupCalls)
  );
  const poolTokens = groupResult(groupCalls, result);

  Object.entries(poolTokens).forEach(poolToken => {
    const [poolId, address] = poolToken[0].split('-');
    if (!pools[poolId].poolTokens) pools[poolId].poolTokens = [];
    pools[poolId].poolTokens.push({ ...poolToken[1], address });
  });

  pools = Object.fromEntries(
    Object.entries(pools).map(pool => {
      let colorIndex = 0;
      pool[1].poolTokens = pool[1].poolTokens
        .map(poolToken => {
          if (config.tokens[poolToken.address]) {
            poolToken.color = config.tokens[poolToken.address].color;
          } else {
            poolToken.color = unknownColors[colorIndex];
            colorIndex++;
          }
          poolToken.weight = new Big(100)
            .div(pool[1].totalDenormWeight.toString())
            .times(poolToken.denormWeight.toString());
          return poolToken;
        })
        .sort((a, b) => b.weight.toString() - a.weight.toString(), 0);
      return pool;
    })
  );

  return pools;
}
