import { JsonRpcProvider, AlchemyProvider } from '@ethersproject/providers';
import config from '@/config';

const provider = new JsonRpcProvider(config.rpcUrl);

export default provider;

export function getLoggingProvider(network: string) {
  const alchemyKey = 'cQGZUiTLRCFsQS7kbRxPJK4eH4fTTu88';
  return new AlchemyProvider(network, alchemyKey);
}