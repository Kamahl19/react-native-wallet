import BitcoreClient from 'bitcore-wallet-client';
import bs58check from 'bs58check';

import config from '../../config';
import { UNITS, networkOptions, feeLevelOptions } from './constants';

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

function parseAmount(text) {
  if (text === '' || typeof text === 'undefined') {
    throw new Error('Missing amount');
  }

  if (typeof text !== 'string') {
    text = text.toString();
  }

  const regex = '^(\\d*(\\.\\d{0,8})?)\\s*(' + Object.keys(UNITS).join('|') + ')?$';
  const match = new RegExp(regex, 'i').exec(text.trim());

  if (!match || match.length === 0) {
    throw new Error('Invalid amount');
  }

  const amount = parseFloat(match[1]);

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Invalid amount');
  }

  const unit = match[3].toLowerCase();
  const rate = UNITS[unit];

  if (!rate) {
    throw new Error('Invalid unit');
  }

  const amountSat = parseFloat((amount * rate.toSatoshis).toPrecision(12));

  if (amountSat !== Math.round(amountSat)) {
    throw new Error('Invalid amount');
  }

  return amountSat;
}

function validateAddress(address) {
  try {
    bs58check.decode(address);
  } catch (err) {
    throw new Error('Address is not valid');
  }
}

function validateWalletName(walletName) {
  if (walletName === '' || typeof walletName === 'undefined') {
    throw new Error('Invalid wallet name');
  }
}

function validateFeeLevel(feeLevel) {
  if (feeLevelOptions.filter(option => option.value === feeLevel).length === 0) {
    throw new Error('Invalid fee level');
  }
}

function validateNetwork(network) {
  if (networkOptions.filter(option => option.value === network).length === 0) {
    throw new Error('Invalid network');
  }
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

function createTxProposalAsync(client, address, amount, feeLevel, note) {
  return new Promise((resolve, reject) => {
    client.createTxProposal(
      {
        outputs: [
          {
            toAddress: address,
            amount,
          },
        ],
        message: note,
        feeLevel,
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

  amount = parseAmount(amount);

  const client = await getClient(wallet);

  let txp = await createTxProposalAsync(client, address, amount, feeLevel, note);

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

export async function importWalletFromMnemonic(mnemonic, network) {
  if (!mnemonic) {
    throw new Error('Missing import data');
  }

  if (!network) {
    throw new Error('Network is missing');
  }

  const client = await getClient();

  await importFromMnemonicAsync(client, mnemonic, network);

  const wallet = JSON.parse(client.export());

  return wallet;
}

export function formatAmount(satoshis, unitShort = UNITS.btc.name) {
  const unit = UNITS[unitShort];

  let amount = satoshis / unit.toSatoshis;

  const parts = amount.toString().split('.');
  const decimal = (parts[1] || '0').substring(0, unit.maxDecimals);

  amount = parseFloat(parts[0] + '.' + decimal).toFixed(unit.maxDecimals);

  return `${amount} ${unit.name}`;
}
