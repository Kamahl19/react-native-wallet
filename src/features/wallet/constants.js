export const UNITS = {
  btc: {
    name: 'btc',
    toSatoshis: 100000000,
    maxDecimals: 8,
    minDecimals: 8,
  },
  bit: {
    name: 'bit',
    toSatoshis: 100,
    maxDecimals: 2,
    minDecimals: 2,
  },
  sat: {
    name: 'sat',
    toSatoshis: 1,
    maxDecimals: 0,
    minDecimals: 0,
  },
};

export const DEFAULT_FEE_LEVEL = 'normal';

export const DEFAULT_NETWORK = __DEV__ ? 'testnet' : 'livenet';

export const feeLevelOptions = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'Priority', value: 'priority' },
  { label: 'Normal', value: 'normal' },
  { label: 'Economy', value: 'economy' },
  { label: 'Super Economy', value: 'superEconomy' },
];

export const networkOptions = [
  { label: 'Testnet', value: 'testnet' },
  { label: 'Livenet', value: 'livenet' },
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
