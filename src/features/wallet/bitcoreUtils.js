import BitcoreClient from 'bitcore-wallet-client';

import config from '../../config';
import {
  parseSatFromBtc,
  validateAddress,
  validateWalletName,
  validateFeeLevel,
  validateNetwork,
} from './btcUtils';

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

  const amountSat = parseSatFromBtc(amount);

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
