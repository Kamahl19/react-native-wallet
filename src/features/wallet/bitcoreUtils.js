import BitcoreClient from 'bitcore-wallet-client';
import bs58check from 'bs58check';

import config from '../../config';
import { COINS, coinOptions, networkOptions, feeLevelOptions } from './constants';

function getClient(wallet) {
  const client = new BitcoreClient({
    baseUrl: config.bwsUrl,
    verbose: __DEV__,
  });

  if (!wallet) {
    return Promise.resolve(client);
  }

  client.import(JSON.stringify(wallet));

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

  const regex = '^(\\d*(\\.\\d{0,8})?)\\s*(' + Object.keys(COINS).join('|') + ')?$';
  const match = new RegExp(regex, 'i').exec(text.trim());

  if (!match || match.length === 0) {
    throw new Error('Invalid amount');
  }

  const amount = parseFloat(match[1]);

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Invalid amount');
  }

  const unit = match[3].toLowerCase();
  const rate = COINS[unit];

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

function validateCoin(coin) {
  if (coinOptions.filter(option => option.value === coin).length === 0) {
    throw new Error('Invalid coin');
  }
}

function validateFeeLevel(feeLevel, coin) {
  if (feeLevelOptions[coin].filter(option => option.value === feeLevel).length === 0) {
    throw new Error('Invalid fee level');
  }
}

function validateNetwork(network) {
  if (networkOptions.filter(option => option.value === network).length === 0) {
    throw new Error('Invalid network');
  }
}

function createWalletAsync(client, walletName, coin, network) {
  return new Promise((resolve, reject) => {
    client.createWallet(
      walletName,
      'me',
      1,
      1,
      {
        coin,
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

      return resolve(res.address);
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

export async function createWallet(walletName, coin, network) {
  validateWalletName(walletName);
  validateCoin(coin);
  validateNetwork(network);

  const client = await getClient();

  client.seedFromRandomWithMnemonic({
    network,
    coin,
  });

  await createWalletAsync(client, walletName, coin, network);

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
  validateFeeLevel(feeLevel, wallet.coin);

  amount = parseAmount(amount);

  const client = await getClient(wallet);

  let txp = await createTxProposalAsync(client, address, amount, feeLevel, note);

  txp = await publishTxProposalAsync(client, txp);

  txp = await signTxProposalAsync(client, txp);

  txp = await broadcastTxProposalAsync(client, txp);

  return txp;
}

// function formatAmount(satoshis, coin) {
//   const u = COINS[coin];

//   let amount = satoshis / u.toSatoshis;

//   const parts = amount.toString().split('.');
//   const decimal = (parts[1] || '0').substring(0, u.maxDecimals);

//   amount = parseFloat(parts[0] + '.' + decimal).toFixed(u.maxDecimals);

//   return `${amount} ${u.name}`;
// }
