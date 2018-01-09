import bs58check from 'bs58check';
import Big from 'big.js';

export const UNITS = {
  btc: {
    name: 'btc',
    toSatoshis: 1e8,
    maxDecimals: 8,
    minDecimals: 8,
  },
  bit: {
    name: 'bit',
    toSatoshis: 1e2,
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

export const FEE_LEVELS = {
  URGENT: 'urgent',
  PRIORITY: 'priority',
  NORMAL: 'normal',
  ECONOMY: 'economy',
  SUPER_ECONOMY: 'superEconomy',
};

export const BTC_NETWORKS = {
  TEST_NET: 'testnet',
  LIVE_NET: 'livenet',
};

export function parseSatFromBtc(amount) {
  if (!amount) {
    throw new Error('Invalid amount');
  }

  const amountSat = Big(amount)
    .times(UNITS.btc.toSatoshis)
    .toFixed(0);

  if (amountSat <= 0) {
    throw new Error('Invalid amount');
  }

  return parseInt(amountSat, 10);
}

export function validateAddress(address) {
  try {
    bs58check.decode(address);
  } catch (err) {
    throw new Error('Invalid address');
  }
}

export function validateWalletName(walletName) {
  if (walletName === '' || typeof walletName === 'undefined') {
    throw new Error('Invalid wallet name');
  }
}

export function validateFeeLevel(feeLevel) {
  if (Object.values(FEE_LEVELS).filter(fl => fl === feeLevel).length === 0) {
    throw new Error('Invalid fee level');
  }
}

export function validateNetwork(network) {
  if (Object.values(BTC_NETWORKS).filter(n => n === network).length === 0) {
    throw new Error('Invalid network');
  }
}

export function convertSatToUsd(satoshi, usdPerBtc) {
  return satoshi / UNITS.btc.toSatoshis * usdPerBtc;
}

export function formatSat(satoshis, unitShort = UNITS.btc.name) {
  const unit = UNITS[unitShort];

  let amount = satoshis / unit.toSatoshis;

  const parts = amount.toString().split('.');
  const decimal = (parts[1] || '0').substring(0, unit.maxDecimals);

  amount = parseFloat(parts[0] + '.' + decimal).toFixed(unit.maxDecimals);

  return `${amount} ${unit.name}`;
}

export function formatUsd(usd) {
  return `$${usd.toFixed(2)}`;
}

export function getExploreAddressUrl(address, network) {
  return `https://live.blockcypher.com/${
    network === BTC_NETWORKS.TEST_NET ? 'btc-testnet' : 'btc'
  }/address/${address}/`;
}

export function getExploreTxUrl(txId, network) {
  return `https://live.blockcypher.com/${
    network === BTC_NETWORKS.TEST_NET ? 'btc-testnet' : 'btc'
  }/tx/${txId}/`;
}
