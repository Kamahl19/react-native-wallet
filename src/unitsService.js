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
 * @param {number|string} satoshi Amount of Satoshi to convert. Must be a whole number
 * @throws {TypeError} Thrown if input is not a number or string
 * @throws {TypeError} Thrown if input is not a whole number
 * @returns {number}
 */
export function satoshiToBitcoin(satoshi) {
  let argType = typeof satoshi;

  if (argType !== 'number' && argType !== 'string') {
    throw new TypeError('satoshiToBitcoin must be called on a number or string, got ' + argType);
  }

  if (argType === 'string') {
    satoshi = Number(satoshi);
  }

  if (!Number.isInteger(satoshi)) {
    throw new TypeError('satoshiToBitcoin must be called on an integer');
  }

  return Number(BigNumber(satoshi).div(UNITS.sat.toBitcoin));
}

/**
 * Convert Bitcoin to Satoshi
 * @param {number|string} bitcoin Amount of Bitcoin to convert
 * @throws {TypeError} Thrown if input is not a number or string
 * @returns {number}
 */
export function bitcoinToSatoshi(bitcoin) {
  let argType = typeof bitcoin;

  if (argType !== 'number' && argType !== 'string') {
    throw new TypeError('bitcoinToSatoshi must be called on a number or string, got ' + argType);
  }

  if (argType === 'string') {
    bitcoin = Number(bitcoin);
  }

  return Number.isNaN(bitcoin)
    ? 0
    : BigNumber(bitcoin)
        .times(UNITS.btc.toSatoshis)
        .toNumber();
}

/**
 * Convert Bitcoin to USD
 * @param {number|string} bitcoin Amount of Bitcoin to convert
 * @param {number|string} btcInUsd Price of BTC in USD
 * @throws {TypeError} Thrown if bitcoin is not a number or string
 * @throws {TypeError} Thrown if btcInUsd is not a number or string
 * @returns {number}
 */
export function bitcoinToUsd(bitcoin, btcInUsd) {
  let bitcoinType = typeof bitcoin;
  let btcInUsdType = typeof btcInUsd;

  if (bitcoinType !== 'number' && bitcoinType !== 'string') {
    throw new TypeError(
      "bitcoinToUsd's parameter bitcoin must be a number or string, got " + bitcoinType
    );
  }

  if (btcInUsdType !== 'number' && btcInUsdType !== 'string') {
    throw new TypeError(
      "bitcoinToUsd's parameter btcInUsd must be a number or string, got " + btcInUsdType
    );
  }

  if (bitcoinType === 'string') {
    bitcoin = Number(bitcoin);
  }

  if (btcInUsdType === 'string') {
    btcInUsd = Number(btcInUsd);
  }

  return Number.isNaN(bitcoin) || Number.isNaN(btcInUsd)
    ? 0
    : Number(
        BigNumber(bitcoin)
          .times(btcInUsd)
          .toFixed(2)
      );
}

/**
 * Convert Satoshi to USD
 * @param {number|string} satoshi Amount of Satoshi to convert. Must be a whole number
 * @param {number|string} btcInUsd Price of BTC in USD
 * @throws {TypeError} Thrown if satoshi is not a number or string
 * @throws {TypeError} Thrown if satoshi is not a whole number
 * @throws {TypeError} Thrown if btcInUsd is not a number or string
 * @returns {number}
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
