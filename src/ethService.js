import { ethers } from 'ethers';

/**
 * CONSTANTS
 */
export const ETH_NETWORKS = {
  mainnet: 'homestead',
  testnet: 'rinkeby',
};

const ETHER_SCAN_MAINNET = new ethers.providers.EtherscanProvider(ETH_NETWORKS.mainnet);
const ETHER_SCAN_TESTNET = new ethers.providers.EtherscanProvider(ETH_NETWORKS.testnet);

const GAS_LIMIT = 21000;

/**
 * WALLET
 */
export function createWallet(network, { mnemonic, privateKey } = {}) {
  validateNetwork(network);

  let wallet;

  if (privateKey) {
    const pk = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;

    validatePrivateKey(pk);

    wallet = new ethers.Wallet(pk);
  } else if (mnemonic) {
    validateMnemonic(mnemonic);

    wallet = ethers.Wallet.fromMnemonic(mnemonic);
  } else {
    wallet = ethers.Wallet.createRandom();
  }

  return wallet.connect(ethers.getDefaultProvider(network));
}

export async function getBalance(wallet) {
  validateWallet(wallet);

  return await wallet.getBalance();
}

export async function getHistory(wallet) {
  validateWallet(wallet);

  return wallet.provider.network.name === ETH_NETWORKS.mainnet
    ? await ETHER_SCAN_MAINNET.getHistory(wallet.address)
    : await ETHER_SCAN_TESTNET.getHistory(wallet.address);
}

export async function sendTransaction(wallet, address, amount) {
  validateWallet(wallet);
  validateAddress(address);
  validateAmount(amount);

  return await wallet.sendTransaction({
    to: ethers.utils.getAddress(address),
    value: ethers.utils.parseEther(amount),
    gasLimit: GAS_LIMIT,
    gasPrice: await wallet.provider.getGasPrice(),
  });
}

/**
 * EXPLORER
 */
export function getExploreTxUrl(txHash, network) {
  return `https://${
    network === ETH_NETWORKS.mainnet ? '' : `${network}.`
  }etherscan.io/tx/${txHash}`;
}

/**
 * FORMATTERS
 */
/**
 * Format Wei to Ether
 * @param {Bignumber} wei amount
 * @returns {string} amount in Ether
 */
export function formatWeiToEther(wei) {
  return ethers.utils.formatEther(wei);
}

/**
 * Format Ether to Wei
 * @param {String} ether amount
 * @returns {BigNumber} amount in Wei
 */
export function parseEther(amount) {
  return ethers.utils.parseEther(amount);
}

/**
 * VALIDATORS
 */
function validateAddress(address) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    throw new Error('Invalid address');
  }
}

function validateMnemonic(mnemonic) {
  if (!ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }
}

function validatePrivateKey(privateKey) {
  if (!privateKey.match(/^0x[0-9A-fa-f]{64}$/)) {
    throw new Error('Invalid privateKey');
  }
}

function validateWallet(wallet) {
  if (!wallet || !wallet.provider) {
    throw new Error('Invalid wallet');
  }
}

function validateAmount(amount) {
  try {
    ethers.utils.parseEther(amount);
  } catch (e) {
    throw new Error('Invalid amount');
  }

  if (Number(amount) <= 0) {
    throw new Error('Invalid amount');
  }
}

function validateNetwork(network) {
  if (!Object.values(ETH_NETWORKS).includes(network)) {
    throw new Error('Invalid network');
  }
}
