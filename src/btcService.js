import bs58check from 'bs58check';
import bip21 from 'bip21';
import BitcoreClient from 'bitcore-wallet-client';

import { bitcoinToSatoshi } from './unitsService';
import config from './config';

const SPEND_UNCONFIRMED = true;

/**
 * CONSTANTS
 */
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
 * Encode BIP21 URI
 * @param {string} address Bitcoin address
 * @param {object} opts { amount, message, label }
 */
export function bip21Encode(address, opts) {
  return bip21.encode(address, opts);
}

/**
 * Decode BIP21 URI
 * @param {string} uri BIP21 uri to be decoded
 */
export function bip21Decode(uri) {
  return bip21.decode(uri);
}

/**
 * Get formatted date and time of the transaction
 * @param {object} tx Transaction
 * @param {string} format Format od datetime
 * @returns {object}
 */
export function getTxDateTime(tx) {
  return (tx.createdOn || tx.time) * 1000;
}

/**
 * WALLET HELPERS
 */

/**
 * Get current confirmed balance of the wallet
 * @param {object} wallet Wallet
 * @returns {number}
 */
export function getWalletBalance(balance) {
  return SPEND_UNCONFIRMED
    ? {
        available: balance.availableAmount,
        locked: balance.lockedAmount,
        confirming: 0,
        total: balance.totalAmount,
      }
    : {
        available: balance.availableConfirmedAmount,
        locked: balance.lockedConfirmedAmount,
        confirming: balance.totalAmount - balance.totalConfirmedAmount,
        total: balance.totalConfirmedAmount,
      };
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

export async function getTransactionFee(wallet, address, amount, feeLevel) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  validateAddress(address);
  validateFeeLevel(feeLevel);

  const amountSat = bitcoinToSatoshi(parseBitcoinInput(amount));

  const client = await getClient(wallet);

  let txp = await createTxProposalAsync(client, address, amountSat, feeLevel, { dryRun: true });

  return txp.fee;
}

export async function sendTransaction(wallet, address, amount, feeLevel) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }

  validateAddress(address);
  validateFeeLevel(feeLevel);

  const amountSat = bitcoinToSatoshi(parseBitcoinInput(amount));

  const client = await getClient(wallet);

  let txp = await createTxProposalAsync(client, address, amountSat, feeLevel);

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

export async function importWalletFromData(walletData) {
  if (!walletData) {
    throw new Error('Missing import data');
  }

  const client = await getClient();

  client.import(walletData);

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

function createTxProposalAsync(client, address, amountSat, feeLevel, opts = { dryRun: false }) {
  return new Promise((resolve, reject) => {
    client.createTxProposal(
      {
        outputs: [
          {
            toAddress: address,
            amount: amountSat,
          },
        ],
        feeLevel,
        excludeUnconfirmedUtxos: !SPEND_UNCONFIRMED,
        dryRun: opts.dryRun,
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
