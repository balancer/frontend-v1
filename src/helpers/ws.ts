import { WebSocketProvider } from '@ethersproject/providers';
import config from '@/helpers/config';

const wsProvider = new WebSocketProvider(config.alchemyWsUrl);

export default wsProvider;
