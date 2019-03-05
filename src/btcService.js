import bs58check from 'bs58check';
import bip21 from 'bip21';
import BitcoreClient from 'bitcore-wallet-client';

import { parseBitcoinInputToSatoshi } from './unitsService';
import config from './config';

export const SPEND_UNCONFIRMED = true;

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

export const NUMBER_OF_NEEDED_CONFIRMATIONS = 1;

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

function validateWalletName(walletName) {
  if (typeof walletName !== 'string' || walletName === '') {
    throw new Error('Invalid wallet name');
  }
}

function validateFeeLevel(feeLevel) {
  if (!Object.values(FEE_LEVELS).find(fl => fl === feeLevel)) {
    throw new Error('Invalid fee level');
  }
}

function validateNetwork(network) {
  if (!Object.values(BTC_NETWORKS).find(n => n === network)) {
    throw new Error('Invalid network');
  }
}

function validateWallet(wallet) {
  if (!wallet) {
    throw new Error('Missing wallet');
  }
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
      tx.confirmations && tx.confirmations >= NUMBER_OF_NEEDED_CONFIRMATIONS
        ? 'confirmed'
        : 'unconfirmed',
  };
}

export function getTxStatus(tx) {
  const { status } = getTxConfirmationStatus(tx);

  if ((tx.action === 'moved' || tx.action === 'sent') && status === 'confirmed') {
    return 'sent';
  } else if (tx.action === 'received' && status === 'confirmed') {
    return 'received';
  } else if ((tx.action === 'moved' || tx.action === 'sent') && status === 'unconfirmed') {
    return 'pending-sent';
  }

  return 'pending-received';
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

  client.seedFromRandomWithMnemonic({ network });

  await createWalletAsync(client, walletName, network);

  return getWalletData(client);
}

export async function generateAddress(wallet) {
  validateWallet(wallet);

  const client = await getClient(wallet);

  return await createAddress(client);
}

export async function getTransactionFee(wallet, address, amount, feeLevel) {
  validateWallet(wallet);
  validateAddress(address);
  validateFeeLevel(feeLevel);

  const amountSat = parseBitcoinInputToSatoshi(amount).toNumber();

  const client = await getClient(wallet);

  const txp = await createTxProposal(client, address, amountSat, feeLevel, { dryRun: true });

  return txp.fee;
}

export async function sendTransaction(wallet, address, amount, feeLevel) {
  validateWallet(wallet);
  validateAddress(address);
  validateFeeLevel(feeLevel);

  const amountSat = parseBitcoinInputToSatoshi(amount).toNumber();

  const client = await getClient(wallet);

  let txp = await createTxProposal(client, address, amountSat, feeLevel);

  txp = await publishTxProposal(client, txp);

  txp = await signTxProposal(client, txp);

  txp = await broadcastTxProposal(client, txp);

  return txp;
}

export async function getBalance(wallet) {
  validateWallet(wallet);

  const client = await getClient(wallet);

  return await getBalanceAsync(client);
}

export async function getTxHistory(wallet) {
  validateWallet(wallet);

  const client = await getClient(wallet);

  return await getTxHistoryAsync(client);
}

export async function getAddresses(wallet) {
  validateWallet(wallet);

  const client = await getClient(wallet);

  return await getAddressesAsync(client);
}

export async function exportWallet(wallet) {
  validateWallet(wallet);

  const client = await getClient(wallet, { doNotOpen: true });

  return client.export();
}

export async function importWalletFromData(walletData) {
  if (!walletData) {
    throw new Error('Missing import data');
  }

  const client = await getClient();

  client.import(walletData);

  return getWalletData(client);
}

export async function importWalletFromMnemonic(mnemonic, network, from3rdParty) {
  if (!mnemonic) {
    throw new Error('Missing import data');
  }

  validateNetwork(network);

  const client = await getClient();

  if (from3rdParty) {
    client.seedFromMnemonic(mnemonic, { network });

    await createWalletAsync(client, 'Imported wallet', network);
  } else {
    await importFromMnemonic(client, mnemonic, network);
  }

  return getWalletData(client);
}

/**
 * BITCORE HELPERS
 */
function getWalletData(client) {
  return JSON.parse(client.export());
}

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
    client.createWallet(walletName, 'me', 1, 1, { network }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

function createAddress(client) {
  return new Promise((resolve, reject) => {
    client.createAddress({ ignoreMaxGap: true }, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function getBalanceAsync(client) {
  return new Promise((resolve, reject) => {
    client.getBalance(undefined, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function getTxHistoryAsync(client) {
  return new Promise((resolve, reject) => {
    client.getTxHistory(undefined, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function getAddressesAsync(client) {
  return new Promise((resolve, reject) => {
    client.getMainAddresses(undefined, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function createTxProposal(client, address, amountSat, feeLevel, opts = { dryRun: false }) {
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
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
}

function publishTxProposal(client, txp) {
  return new Promise((resolve, reject) => {
    client.publishTxProposal({ txp }, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function signTxProposal(client, txp) {
  return new Promise((resolve, reject) => {
    client.signTxProposal(txp, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function broadcastTxProposal(client, txp) {
  return new Promise((resolve, reject) => {
    client.broadcastTxProposal(txp, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function importFromMnemonic(client, mnemonic, network) {
  return new Promise((resolve, reject) => {
    client.importFromMnemonic(mnemonic, { network }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}
