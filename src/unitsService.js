import BigNumber from 'bignumber.js';
import { formatWeiToEther } from './ethService';

export const UNITS = {
  btc: {
    toSatoshis: 1e8,
    toBitcoin: 1,
  },
  sat: {
    toSatoshis: 1,
    toBitcoin: 1e8,
  },
};

/**
 * Convert Satoshi to Bitcoin
 * @param {number|string|BigNumber} satoshi Amount of Satoshi to convert
 * @returns {BigNumber}
 */
export function satoshiToBitcoin(satoshi) {
  const satoshiBig = BigNumber(satoshi).decimalPlaces(0, 1);

  return satoshiBig.isNaN() ? BigNumber(0) : satoshiBig.div(UNITS.sat.toBitcoin);
}

/**
 * Convert Bitcoin to Satoshi
 * @param {number|string|BigNumber} bitcoin Amount of Bitcoin to convert
 * @returns {BigNumber}
 */
export function bitcoinToSatoshi(bitcoin) {
  const bitcoinBig = BigNumber(bitcoin);

  return bitcoinBig.isNaN() ? BigNumber(0) : bitcoinBig.times(UNITS.btc.toSatoshis);
}

/**
 * Convert Bitcoin to USD
 * @param {number|string|BigNumber} bitcoin Amount of Bitcoin to convert
 * @param {number|string|BigNumber} btcInUsd Price of BTC in USD
 * @returns {BigNumber}
 */
export function bitcoinToUsd(bitcoin, btcInUsd) {
  const bitcoinBig = BigNumber(bitcoin);
  const btcInUsdBig = BigNumber(btcInUsd);

  return bitcoinBig.isNaN() || btcInUsdBig.isNaN()
    ? BigNumber(0)
    : bitcoinBig.times(btcInUsdBig).decimalPlaces(2);
}

/**
 * Convert Satoshi to USD
 * @param {number|string|BigNumber} satoshi Amount of Satoshi to convert. Must be a whole number
 * @param {number|string|BigNumber} btcInUsd Price of BTC in USD
 * @returns {BigNumber}
 */
export function satoshiToUsd(satoshi, btcInUsd) {
  return bitcoinToUsd(satoshiToBitcoin(satoshi), btcInUsd);
}

/**
 * Convert Wei to USD
 * @param {BigNumber} wei Amount of Wei to convert
 * @param {number|string} ethInUsd Price of ETH in USD
 * @returns {number}
 */
export function weiToUsd(wei, ethInUsd) {
  return (formatWeiToEther(wei) * ethInUsd).toFixed(2);
}
