import cryptocompare from 'cryptocompare';
import bs58check from 'bs58check';
import Big from 'big.js';
import moment from 'moment';
import BitcoreClient from 'bitcore-wallet-client';

import config from './config';

/**
 * CONSTANTS
 */
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

export const TX_ACTIONS = {
  SENT: 'sent',
  RECEIVED: 'received',
};

export const numberOfNeededConfirmations = 1;

/**
 * VALIDATORS
 */
export function validateAddress(address) {
  try {
    bs58check.decode(address);
  } catch (err) {
    throw new Error('Invalid address');
  }
}

export function validateWalletName(walletName) {
  if (typeof walletName !== 'string' || walletName === '') {
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

/**
 * PRICE
 */

/**
 * Get prices
 * @param {array} fromCoins
 * @param {array} toCoins
 */
export async function getPrices(fromCoins, toCoins) {
  return await cryptocompare.priceMulti(fromCoins, toCoins);
}

/**
 * CONVERTERS
 */

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
    throw new TypeError('satoshiToBitcoin must be called on a whole number');
  }

  return Number(Big(satoshi).div(UNITS.sat.toBitcoin));
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

  return Number(Big(bitcoin).times(UNITS.btc.toSatoshis));
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

  return Number(
    Big(bitcoin)
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
 * Parse string to Bitcoin
 * @param {string} input Input to be parsed to bitcoin
 * @throws {TypeError} Thrown if input is not string or is empty string
 * @throws {TypeError} Thrown if input cannot be parsed to number or is <= 0
 * @returns {number}
 */
export function parseBitcoinInput(input) {
  if (typeof input !== 'string' || input === '') {
    throw new Error('Invalid amount');
  }

  input = input.replace(',', '.');

  const bitcoin = parseFloat(input);

  if (Number.isNaN(bitcoin) || typeof bitcoin !== 'number' || bitcoin <= 0) {
    throw new Error('Invalid amount');
  }

  return bitcoin;
}

/**
 * EXPLORER
 */

/**
 * Get an URL to explore the Address
 * @param {string} address Bitcoin address we want to explore
 * @param {string} network Bitcoin network
 * @returns {string}
 */
export function getExploreAddressUrl(address, network) {
  return `https://live.blockcypher.com/${
    network === BTC_NETWORKS.TEST_NET ? 'btc-testnet' : 'btc'
  }/address/${address}/`;
}

/**
 * Get an URL to explore the Transaction
 * @param {string} txId ID of the bitcoin transaction we want to explore
 * @param {string} network Bitcoin network
 * @returns {string}
 */
export function getExploreTxUrl(txId, network) {
  return `https://live.blockcypher.com/${
    network === BTC_NETWORKS.TEST_NET ? 'btc-testnet' : 'btc'
  }/tx/${txId}/`;
}

/**
 * TRANSACTION HELPERS
 */

/**
 * Get a status and number of confirmations of the transaction
 * @param {object} tx Transaction
 * @returns {object}
 */
export function getTxConfirmationStatus(tx) {
  return {
    confirmations: tx.confirmations || 0,
    status:
      tx.confirmations && tx.confirmations >= numberOfNeededConfirmations
        ? 'confirmed'
        : 'unconfirmed',
  };
}

/**
 * Get formatted date and time of the transaction
 * @param {object} tx Transaction
 * @param {string} format Format od datetime
 * @returns {object}
 */
export function getTxDateTime(tx, format = 'MM/DD/YYYY hh:mm A') {
  return moment((tx.createdOn || tx.time) * 1000).format(format);
}

/**
 * WALLET HELPERS
 */

/**
 * Get current confirmed balance of the wallet
 * @param {object} wallet Wallet
 * @returns {number}
 */
export function getWalletBalance(wallet) {
  return wallet.balance.availableConfirmedAmount;
}

/**
 * BITCORE
 */
export async function createWallet(walletName, network) {
  validateWalletName(walletName);
  validateNetwork(network);

  const client = await getClient();

  client.seedFromRandomWithMnemonic({
    network,
  });

  await createWalletAsync(client, walletName, network);

  const wallet = JSON.parse(client.export());

  return wallet;
}

export async function generateAddress(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  const client = await getClient(wallet);

  const address = await createAddressAsync(client);

  return address;
}

export async function sendTransaction(wallet, address, amount, feeLevel, note) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  validateAddress(address);
  validateFeeLevel(feeLevel);

  const amountSat = bitcoinToSatoshi(parseBitcoinInput(amount));

  const client = await getClient(wallet);

  let txp = await createTxProposalAsync(client, address, amountSat, feeLevel, note);

  txp = await publishTxProposalAsync(client, txp);

  txp = await signTxProposalAsync(client, txp);

  txp = await broadcastTxProposalAsync(client, txp);

  return txp;
}

export async function getBalance(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  const client = await getClient(wallet);

  const balance = await getBalanceAsync(client);

  return balance;
}

export async function getTxHistory(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  const client = await getClient(wallet);

  const txs = await getTxHistoryAsync(client);

  return txs;
}

export async function getAddresses(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  const client = await getClient(wallet);

  const addresses = await getAddressesAsync(client);

  return addresses;
}

export async function exportWallet(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  const client = await getClient(wallet, { doNotOpen: true });

  const walletData = client.export();

  return walletData;
}

export async function importWallet(importData) {
  if (!importData) {
    throw new Error('Missing import data');
  }

  const client = await getClient();

  client.import(importData);

  const wallet = JSON.parse(client.export());

  return wallet;
}

export async function importWalletFromMnemonic(mnemonic, network, from3rdParty) {
  if (!mnemonic) {
    throw new Error('Missing import data');
  }

  if (!network) {
    throw new Error('Network is missing');
  }

  const client = await getClient();

  if (from3rdParty) {
    client.seedFromMnemonic(mnemonic, { network });

    await createWalletAsync(client, 'Imported wallet', network);
  } else {
    await importFromMnemonicAsync(client, mnemonic, network);
  }

  const wallet = JSON.parse(client.export());

  return wallet;
}

/**
 * BITCORE HELPERS
 */
function getClient(wallet, opts = {}) {
  const client = new BitcoreClient({
    baseUrl: config.bwsUrl,
    verbose: __DEV__,
  });

  if (!wallet) {
    return Promise.resolve(client);
  }

  client.import(JSON.stringify(wallet));

  if (opts.doNotOpen) {
    return Promise.resolve(client);
  }

  return new Promise((resolve, reject) => {
    client.openWallet(err => {
      if (err) {
        return reject(err);
      }

      return resolve(client);
    });
  });
}

function createWalletAsync(client, walletName, network) {
  return new Promise((resolve, reject) => {
    client.createWallet(
      walletName,
      'me',
      1,
      1,
      {
        network,
      },
      err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      }
    );
  });
}

function createAddressAsync(client) {
  return new Promise((resolve, reject) => {
    client.createAddress(undefined, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}

function getBalanceAsync(client) {
  return new Promise((resolve, reject) => {
    client.getBalance(undefined, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}

function getTxHistoryAsync(client) {
  return new Promise((resolve, reject) => {
    client.getTxHistory(undefined, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}

function getAddressesAsync(client) {
  return new Promise((resolve, reject) => {
    client.getMainAddresses(undefined, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}

function createTxProposalAsync(client, address, amountSat, feeLevel, note) {
  return new Promise((resolve, reject) => {
    client.createTxProposal(
      {
        outputs: [
          {
            toAddress: address,
            amount: amountSat,
          },
        ],
        message: note,
        feeLevel,
        excludeUnconfirmedUtxos: true,
      },
      (err, txp) => {
        if (err) {
          return reject(err);
        }

        return resolve(txp);
      }
    );
  });
}

function publishTxProposalAsync(client, txp) {
  return new Promise((resolve, reject) => {
    client.publishTxProposal({ txp }, (err, txp) => {
      if (err) {
        return reject(err);
      }

      return resolve(txp);
    });
  });
}

function signTxProposalAsync(client, txp) {
  return new Promise((resolve, reject) => {
    client.signTxProposal(txp, (err, txp) => {
      if (err) {
        return reject(err);
      }

      return resolve(txp);
    });
  });
}

function broadcastTxProposalAsync(client, txp) {
  return new Promise((resolve, reject) => {
    client.broadcastTxProposal(txp, (err, txp) => {
      if (err) {
        return reject(err);
      }

      return resolve(txp);
    });
  });
}

function importFromMnemonicAsync(client, mnemonic, network) {
  return new Promise((resolve, reject) => {
    client.importFromMnemonic(mnemonic, { network }, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}
