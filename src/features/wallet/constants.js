import { FEE_LEVELS, BTC_NETWORKS, TX_ACTIONS } from './btcUtils';

export const DEFAULT_FEE_LEVEL = FEE_LEVELS.NORMAL;

export const DEFAULT_NETWORK = __DEV__ ? BTC_NETWORKS.TEST_NET : BTC_NETWORKS.LIVE_NET;

export const DEFAULT_TX_ACTION = TX_ACTIONS.SENT;

export const feeLevelOptions = [
  { label: 'Urgent', value: FEE_LEVELS.URGENT },
  { label: 'Priority', value: FEE_LEVELS.PRIORITY },
  { label: 'Normal', value: FEE_LEVELS.NORMAL },
  { label: 'Economy', value: FEE_LEVELS.ECONOMY },
  { label: 'Super Economy', value: FEE_LEVELS.SUPER_ECONOMY },
];

export const networkOptions = [
  { label: 'Testnet', value: BTC_NETWORKS.TEST_NET },
  { label: 'Livenet', value: BTC_NETWORKS.LIVE_NET },
];

export const txActionsOptions = [
  { label: 'Sent', value: TX_ACTIONS.SENT },
  { label: 'Received', value: TX_ACTIONS.RECEIVED },
];

export const apiCallIds = {
  CREATE_WALLET: 'CREATE_WALLET',
  SEND_TRANSACTION: 'SEND_TRANSACTION',
  GENERATE_ADDRESS: 'GENERATE_ADDRESS',
  GET_BALANCE: 'GET_BALANCE',
  GET_ADDRESSES: 'GET_ADDRESSES',
  GET_TX_HISTORY: 'GET_TX_HISTORY',
  EXPORT_WALLET: 'EXPORT_WALLET',
  IMPORT_WALLET: 'IMPORT_WALLET',
};

export const FETCH_BALANCE_INTERVAL_MS = __DEV__ ? 60000 : 10000;

export const FETCH_PRICES_INTERVAL_MS = __DEV__ ? 60000 : 10000;
