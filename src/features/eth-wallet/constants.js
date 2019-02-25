import { capitalize } from '../../common/utils/helpers';
import { ETH_NETWORKS } from '../../ethService';

export const DEFAULT_NETWORK = __DEV__ ? ETH_NETWORKS.testnet : ETH_NETWORKS.mainnet;

export const networkOptions = [
  { label: capitalize(ETH_NETWORKS.testnet), value: ETH_NETWORKS.testnet },
  { label: capitalize(ETH_NETWORKS.mainnet), value: ETH_NETWORKS.mainnet },
];

export const apiCallIds = {
  CREATE_WALLET: 'CREATE_WALLET',
  SEND_TRANSACTION: 'SEND_TRANSACTION',
  GET_BALANCE: 'GET_BALANCE',
  GET_TX_HISTORY: 'GET_TX_HISTORY',
};
