import { Lock } from '@bonustrack/lock/dist/lock.cjs';
import config from '@/helpers/config';
import injected from '@bonustrack/lock/connectors/injected';
import portis from '@bonustrack/lock/connectors/portis';
import walletconnect from '@bonustrack/lock/connectors/walletconnect';
import walletlink from '@bonustrack/lock/connectors/walletlink';

const connectors = { injected, portis, walletconnect, walletlink };
const lock = new Lock();
Object.entries(config.connectors).forEach((connector: any) => {
  lock.addConnector({
    key: connector[0],
    connector: connectors[connector[0]],
    options: connector[1].options
  });
});

export default lock;
