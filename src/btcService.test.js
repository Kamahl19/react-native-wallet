import bip39 from 'bip39';

import {
  parseBitcoinInput,
  getExploreAddressUrl,
  getExploreTxUrl,
  getTxConfirmationStatus,
  bip21Encode,
  bip21Decode,
  getTxDateTime,
  getWalletBalance,
  createWallet,
  generateAddress,
  getTransactionFee,
  sendTransaction,
  getBalance,
  getTxHistory,
  getAddresses,
  exportWallet,
  importWalletFromData,
  importWalletFromMnemonic,
  BTC_NETWORKS,
  SPEND_UNCONFIRMED,
  FEE_LEVELS,
} from './btcService';

const btcAddress = '3Nrj1FpEaz4R576GTWw5wgTcBwsn6znjV4';
const btcTestnetAddress = 'n3WDexiKdJ7RA2xW1Zxx16UpBtuy276Los';

describe('btcService.js', () => {
  describe('#parseBitcoinInput', () => {
    it('should parse the string to BTC amount', async () => {
      expect(parseBitcoinInput('10.123456')).toEqual(10.123456);
      expect(parseBitcoinInput('1,2')).toEqual(1.2);
    });

    it('should throw if value cant be parsed to BTC amount', async () => {
      expect(() => parseBitcoinInput(true)).toThrow('Invalid amount');
      expect(() => parseBitcoinInput('')).toThrow('Invalid amount');
      expect(() => parseBitcoinInput('a')).toThrow('Invalid amount');
      expect(() => parseBitcoinInput('-1')).toThrow('Invalid amount');
    });
  });

  describe('#getExploreAddressUrl', () => {
    it('should get mainnet url for address', () => {
      expect(getExploreAddressUrl(btcAddress, BTC_NETWORKS.LIVE_NET)).toBe(
        `https://live.blockcypher.com/btc/address/${btcAddress}/`
      );
    });

    it('should get testnet url for address', () => {
      expect(getExploreAddressUrl(btcTestnetAddress, BTC_NETWORKS.TEST_NET)).toBe(
        `https://live.blockcypher.com/btc-testnet/address/${btcTestnetAddress}/`
      );
    });
  });

  describe('#getExploreTxUrl', () => {
    it('should get mainnet url for transaction', () => {
      const txHash = '3b9b3882820b0a1d2316fe8ea580f966f2630722b3bef09ed1c98d77e15a93f5';
      expect(getExploreTxUrl(txHash, BTC_NETWORKS.LIVE_NET)).toBe(
        `https://live.blockcypher.com/btc/tx/${txHash}/`
      );
    });

    it('should get testnet url for transaction', () => {
      const txHash = '5dc8a2a75efc99946fd32a8599fd23fdc82beb8f9a14df1c081df0f418deee8b';
      expect(getExploreTxUrl(txHash, BTC_NETWORKS.TEST_NET)).toBe(
        `https://live.blockcypher.com/btc-testnet/tx/${txHash}/`
      );
    });
  });

  describe('#getTxConfirmationStatus', () => {
    it('should return a confirmed status', () => {
      const tx = { confirmations: 5 };

      expect(getTxConfirmationStatus(tx)).toEqual({
        confirmations: tx.confirmations,
        status: 'confirmed',
      });
    });

    it('should return unconfirmed status', () => {
      expect(getTxConfirmationStatus({})).toEqual({
        confirmations: 0,
        status: 'unconfirmed',
      });
    });
  });

  describe('#bip21Encode', () => {
    it('should encode BIP21 URI', () => {
      expect(bip21Encode(btcAddress)).toEqual(`bitcoin:${btcAddress}`);
    });
  });

  describe('#bip21Decode', () => {
    it('should decode BIP21 URI', () => {
      expect(bip21Decode(`bitcoin:${btcAddress}`)).toEqual({ address: btcAddress, options: {} });
    });
  });

  describe('#getTxDateTime', () => {
    const now = new Date().getTime();

    it('should get formatted date and time of the tx', () => {
      expect(getTxDateTime({ createdOn: now })).toEqual(now * 1000);
      expect(getTxDateTime({ time: now })).toEqual(now * 1000);
    });
  });

  describe('#getWalletBalance', () => {
    const balance = {
      availableAmount: 1,
      lockedAmount: 2,
      totalAmount: 3,
      availableConfirmedAmount: 1,
      lockedConfirmedAmount: 2,
      totalConfirmedAmount: 3,
    };

    it('should get formatted date and time of the tx', () => {
      expect(getWalletBalance(balance)).toEqual(
        SPEND_UNCONFIRMED
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
            }
      );
    });
  });

  describe('#createWallet', () => {
    const walletName = 'walletName';
    const network = BTC_NETWORKS.LIVE_NET;

    it('should create a new wallet', async () => {
      const wallet = await createWallet(walletName, network);

      expect(wallet.walletName).toEqual(walletName);
      expect(wallet.network).toEqual(network);
    });

    it('should throw if invalid walletName provided', () =>
      testError(() => createWallet(undefined, network), 'Invalid wallet name'));

    it('should throw if invalid network provided', () =>
      testError(() => createWallet(walletName), 'Invalid network'));
  });

  describe('#generateAddress', () => {
    it('should generate a new address', async () => {
      const { wallet } = getMocketData();
      const address = await generateAddress(wallet);

      expect(address).toMatchObject({
        beRegistered: null,
        coin: wallet.coin,
        isChange: false,
        network: wallet.network,
        type: wallet.addressType,
        version: '1.0.0',
        walletId: wallet.walletId,
      });

      expect(address.address).toBeTruthy();
    });

    it('should throw if no wallet provided', () => testError(generateAddress, 'Missing wallet'));
  });

  describe('#getTransactionFee', () => {
    const {
      wallet,
      address: { address },
    } = getMocketData();
    const amount = '1';

    it('should throw because wallet is not funded', () =>
      testError(
        () => getTransactionFee(wallet, address, amount, FEE_LEVELS.NORMAL),
        'Insufficient funds'
      ));

    it('should throw if no wallet provided', () => testError(getTransactionFee, 'Missing wallet'));

    it('should throw if invalid address provided', () =>
      testError(() => getTransactionFee(wallet), 'Invalid address'));

    it('should throw if invalid feeLevel provided', () =>
      testError(() => getTransactionFee(wallet, address), 'Invalid fee level'));
  });

  describe('#sendTransaction', () => {
    const {
      wallet,
      address: { address },
    } = getMocketData();
    const amount = '1';

    it('should throw because wallet is not funded', () =>
      testError(
        () => sendTransaction(wallet, address, amount, FEE_LEVELS.NORMAL),
        'Insufficient funds'
      ));

    it('should throw if no wallet provided', () => testError(sendTransaction, 'Missing wallet'));

    it('should throw if invalid address provided', () =>
      testError(() => sendTransaction(wallet), 'Invalid address'));

    it('should throw if invalid feeLevel provided', () =>
      testError(() => sendTransaction(wallet, address), 'Invalid fee level'));
  });

  describe('#getBalance', () => {
    const { wallet } = getMocketData();

    it('should get balance', async () => {
      const balance = await getBalance(wallet);

      expect(balance).toEqual({
        availableAmount: 0,
        availableConfirmedAmount: 0,
        byAddress: [],
        lockedAmount: 0,
        lockedConfirmedAmount: 0,
        totalAmount: 0,
        totalConfirmedAmount: 0,
      });
    });

    it('should throw if no wallet provided', () => testError(getBalance, 'Missing wallet'));
  });

  describe('#getTxHistory', () => {
    const { wallet } = getMocketData();

    it('should get transaction history', async () => {
      const txHistory = await getTxHistory(wallet);
      expect(txHistory).toEqual([]);
    });

    it('should throw if no wallet provided', () => testError(getTxHistory, 'Missing wallet'));
  });

  describe('#getAddresses', () => {
    const {
      wallet2,
      address2: { address },
    } = getMocketData();

    it('should get addresses', async () => {
      const addresses = await getAddresses(wallet2);
      expect(addresses[0].address).toEqual(address);
    });

    it('should throw if no wallet provided', () => testError(getAddresses, 'Missing wallet'));
  });

  describe('#exportWallet', () => {
    const { wallet, exportedWallet } = getMocketData();

    it('should export the wallet', async () => {
      const res = await exportWallet(wallet);
      expect(res).toBe(exportedWallet);
    });

    it('should throw if no wallet provided', () => testError(exportWallet, 'Missing wallet'));
  });

  describe('#importWalletFromData', () => {
    const { wallet, exportedWallet } = getMocketData();

    it('should import the wallet', async () => {
      const res = await importWalletFromData(exportedWallet);
      expect(res).toEqual(wallet);
    });

    it('should throw if no wallet data provided', () =>
      testError(importWalletFromData, 'Missing import data'));
  });

  describe('#importWalletFromMnemonic', () => {
    const { wallet } = getMocketData();
    const randomMnemonic = bip39.generateMnemonic();

    it('should import the wallet from mnemonic', async () => {
      const res = await importWalletFromMnemonic(wallet.mnemonic, wallet.network);
      expect(res.walletId).toBe(wallet.walletId);
    });

    it('should import the wallet from mnemonic generated by 3rd party (not bitcore)', async () => {
      const res = await importWalletFromMnemonic(randomMnemonic, BTC_NETWORKS.LIVE_NET, true);
      expect(res).toBeTruthy();
    });

    it('should throw if no mnemonic provided', () =>
      testError(importWalletFromMnemonic, 'Missing import data'));

    it('should throw if no network provided', () =>
      testError(() => importWalletFromMnemonic(wallet.mnemonic), 'Invalid network'));
  });
});

async function testError(cb, message) {
  try {
    await cb();
  } catch (e) {
    expect(e).toEqual(new Error(message));
  }
}

function getMocketData() {
  return {
    wallet: {
      coin: 'btc',
      network: 'livenet',
      xPrivKey:
        'xprv9s21ZrQH143K4JZRMRakg6zFEFMBr2Kfok1CWyweeRCDPfPc5V1pyGXU814p1WyoeJ9ZDnQfuLiAUiNoVoCSM6X41w13MyStyvHDK5ZJTvV',
      xPubKey:
        'xpub6Buqp5NKky52UJG5dEKWXp19TSHw7m21Jr64xDQrvgFZCDgbDJfu5XG9DeRzeANgU3hLfqciLGMq8xpmnj4icgh8uQmEN5RNq6xGukrt7jy',
      requestPrivKey: 'f9c2cb15b6752fe13b83151174667504f3451ef076e20a01eee3937d7370cd60',
      requestPubKey: '0219ab0a7399cdd829397e9e9717d641129dde59b3127c8941cdde71c7b3c2c246',
      copayerId: '5faa62e514364360619c67ad8f1fb02919937408ee4557770a270a3c48d27413',
      publicKeyRing: [
        {
          xPubKey:
            'xpub6Buqp5NKky52UJG5dEKWXp19TSHw7m21Jr64xDQrvgFZCDgbDJfu5XG9DeRzeANgU3hLfqciLGMq8xpmnj4icgh8uQmEN5RNq6xGukrt7jy',
          requestPubKey: '0219ab0a7399cdd829397e9e9717d641129dde59b3127c8941cdde71c7b3c2c246',
        },
      ],
      walletId: '3c5c205a-9c97-4e4f-b34b-0bccdb234641',
      walletName: 'walletName',
      m: 1,
      n: 1,
      walletPrivKey: '93fd65b900c35e91896e0662a02c318ed7d733773186b7426eb3c2ff3d670a8f',
      personalEncryptingKey: 'WHCeAkz09qNHnqYYGGmfYw==',
      sharedEncryptingKey: 'envEKM1LCaTqHSwWWrKLlg==',
      copayerName: 'me',
      mnemonic: 'you quote useless luggage typical bean predict turtle resist system inch animal',
      entropySource: 'f86b63016906007b843fdef5158f15166625966e4abaae6bfe01a86baece9c56',
      mnemonicHasPassphrase: false,
      derivationStrategy: 'BIP44',
      account: 0,
      compliantDerivation: true,
      addressType: 'P2PKH',
    },
    address: {
      version: '1.0.0',
      createdOn: 1551199906,
      address: '1NhdkX4xCu9WKJawFRMjJwM4VfoFLJh48w',
      walletId: '3c5c205a-9c97-4e4f-b34b-0bccdb234641',
      isChange: false,
      path: 'm/0/15',
      publicKeys: ['02bf70d0a1ceae60a959bd56b564b8586f89a32ec6a9d6160fbcbdc08f63371380'],
      coin: 'btc',
      network: 'livenet',
      type: 'P2PKH',
      beRegistered: null,
      _id: '5c756ea28e32862d6b8bae16',
    },
    wallet2: {
      coin: 'btc',
      network: 'livenet',
      xPrivKey:
        'xprv9s21ZrQH143K4HZVP9oyAqjR3V9qmApFVSBBr3xrHqpuhrGXU5shrGfUn26AT2FixASDqTde6M3VoAKapR2B5xPUDjsdC4fczrGnwn3BniR',
      xPubKey:
        'xpub6CwPstJMZcKh6rqhZGdWnVEKFpypJUcQcRrd4mMyedsRLFjsiUvw3yg6JRSMrL91LoqkvW7BVNdCBuzEudxMyToNpZTy49mDBYzEp6QLrPD',
      requestPrivKey: 'd4ba0864e834a13b2946cad9721b6258d7af684338c54287029ecd26b400d06e',
      requestPubKey: '02bca6d2b22a900aaf520dff383993c869c6a2ee915351ea7b611dc24d6c87515f',
      copayerId: '77707731ffab8924a967979448b77e8a5f7b79b1a53d736187d5fab60b0ce710',
      publicKeyRing: [
        {
          xPubKey:
            'xpub6CwPstJMZcKh6rqhZGdWnVEKFpypJUcQcRrd4mMyedsRLFjsiUvw3yg6JRSMrL91LoqkvW7BVNdCBuzEudxMyToNpZTy49mDBYzEp6QLrPD',
          requestPubKey: '02bca6d2b22a900aaf520dff383993c869c6a2ee915351ea7b611dc24d6c87515f',
        },
      ],
      walletId: '228ab4c9-ac84-4bde-8f23-d5d3165e5f94',
      walletName: 'walletName',
      m: 1,
      n: 1,
      walletPrivKey: '49d83498b12766246f04523bfaf397c9aa8686f0a98359ff32cfce0ac2226259',
      personalEncryptingKey: 'XilGU/v5hziieyArfVS4rg==',
      sharedEncryptingKey: 'jxIz7+pKOhf4c/g452M7PQ==',
      copayerName: 'me',
      mnemonic: 'ski napkin waste finger debate insect gravity local bike chief shrug govern',
      entropySource: 'a9bf26a6584f3d6d8a0c20c505cdbe657bfc042d2575855d93ae12d6f41d995a',
      mnemonicHasPassphrase: false,
      derivationStrategy: 'BIP44',
      account: 0,
      compliantDerivation: true,
      addressType: 'P2PKH',
    },
    address2: {
      version: '1.0.0',
      createdOn: 1551203437,
      address: '13xPyufHXhZ8AWq3uzxjBfHELULeTFaekR',
      walletId: '228ab4c9-ac84-4bde-8f23-d5d3165e5f94',
      isChange: false,
      path: 'm/0/0',
      publicKeys: ['02fa7cc3ccd5633d7180883586ccc1d25af46bf250a0c3e93d450b8f6e7d5f0708'],
      coin: 'btc',
      network: 'livenet',
      type: 'P2PKH',
      beRegistered: null,
      _id: '5c757c6d24250f1bc80e791b',
    },
    exportedWallet:
      '{"coin":"btc","network":"livenet","xPrivKey":"xprv9s21ZrQH143K4JZRMRakg6zFEFMBr2Kfok1CWyweeRCDPfPc5V1pyGXU814p1WyoeJ9ZDnQfuLiAUiNoVoCSM6X41w13MyStyvHDK5ZJTvV","xPubKey":"xpub6Buqp5NKky52UJG5dEKWXp19TSHw7m21Jr64xDQrvgFZCDgbDJfu5XG9DeRzeANgU3hLfqciLGMq8xpmnj4icgh8uQmEN5RNq6xGukrt7jy","requestPrivKey":"f9c2cb15b6752fe13b83151174667504f3451ef076e20a01eee3937d7370cd60","requestPubKey":"0219ab0a7399cdd829397e9e9717d641129dde59b3127c8941cdde71c7b3c2c246","copayerId":"5faa62e514364360619c67ad8f1fb02919937408ee4557770a270a3c48d27413","publicKeyRing":[{"xPubKey":"xpub6Buqp5NKky52UJG5dEKWXp19TSHw7m21Jr64xDQrvgFZCDgbDJfu5XG9DeRzeANgU3hLfqciLGMq8xpmnj4icgh8uQmEN5RNq6xGukrt7jy","requestPubKey":"0219ab0a7399cdd829397e9e9717d641129dde59b3127c8941cdde71c7b3c2c246"}],"walletId":"3c5c205a-9c97-4e4f-b34b-0bccdb234641","walletName":"walletName","m":1,"n":1,"walletPrivKey":"93fd65b900c35e91896e0662a02c318ed7d733773186b7426eb3c2ff3d670a8f","personalEncryptingKey":"WHCeAkz09qNHnqYYGGmfYw==","sharedEncryptingKey":"envEKM1LCaTqHSwWWrKLlg==","copayerName":"me","mnemonic":"you quote useless luggage typical bean predict turtle resist system inch animal","entropySource":"f86b63016906007b843fdef5158f15166625966e4abaae6bfe01a86baece9c56","mnemonicHasPassphrase":false,"derivationStrategy":"BIP44","account":0,"compliantDerivation":true,"addressType":"P2PKH"}',
  };
}
