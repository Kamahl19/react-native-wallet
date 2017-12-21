export const COINS = {
  btc: {
    name: 'btc',
    toSatoshis: 100000000,
    maxDecimals: 8,
    minDecimals: 8,
  },
  bch: {
    name: 'bch',
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

export const coinOptions = [
  { label: 'Bitcoin', value: 'btc' },
  { label: 'Bitcoin Cash', value: 'bch' },
];

export const networkOptions = [
  { label: 'Testnet', value: 'testnet' },
  { label: 'Livenet', value: 'livenet' },
];

export const apiCallIds = {
  CREATE_WALLET: 'CREATE_WALLET',
  SEND_TRANSACTION: 'SEND_TRANSACTION',
  GENERATE_ADDRESS: 'GENERATE_ADDRESS',
};
