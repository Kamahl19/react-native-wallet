import {
  createWallet,
  sendTransaction,
  getBalance,
  getHistory,
  formatWeiToEther,
  getExploreTxUrl,
  ETH_NETWORKS,
} from './ethService';

describe('ethService.js', () => {
  const wallet = createWallet(ETH_NETWORKS.testnet);

  describe('#createWallet', () => {
    it('should create a new wallet', () => {
      expect(wallet.mnemonic).toBeDefined();
    });

    it('should connect to a network', () => {
      expect(wallet.provider.network.name).toBe(ETH_NETWORKS.testnet);
    });

    it('should restore from mnemonic', () => {
      const wallet2 = createWallet(ETH_NETWORKS.testnet, { mnemonic: wallet.mnemonic });

      expect(wallet.privateKey).toEqual(wallet2.privateKey);
    });

    it('should throw when using invalid mnemonic', () => {
      expect(() => createWallet(ETH_NETWORKS.testnet, { mnemonic: 'invalid' })).toThrow(
        'Invalid mnemonic'
      );
    });

    it('should restore from privateKey', () => {
      const wallet2 = createWallet(ETH_NETWORKS.testnet, { privateKey: wallet.privateKey });

      expect(wallet.privateKey).toEqual(wallet2.privateKey);
    });

    it('should throw when using invalid privateKey', () => {
      expect(() => createWallet(ETH_NETWORKS.testnet, { privateKey: 'invalid' })).toThrow(
        'Invalid privateKey'
      );
    });

    it('should throw when using invalid network', () => {
      expect(() => createWallet()).toThrow('Invalid network');
    });
  });

  describe('#getBalance', () => {
    it('should return the balance', async () => {
      const balance = await getBalance(wallet);

      expect(balance).toEqual({ _hex: '0x0' });
    });

    it('should throw if no wallet provided', async () => {
      try {
        await getBalance();
      } catch (e) {
        expect(e).toEqual(new Error('Invalid wallet'));
      }
    });
  });

  describe('#getHistory', () => {
    it('should return the history', async () => {
      const history = await getHistory(wallet);

      expect(history).toEqual([]);
    });

    it('should throw if invalid wallet provided', async () => {
      try {
        await getHistory();
      } catch (e) {
        expect(e).toEqual(new Error('Invalid wallet'));
      }
    });
  });

  describe('#sendTransaction', () => {
    const { address } = createWallet(ETH_NETWORKS.testnet);
    const amount = '0.000000000000000001';

    it('should throw because of insufficient funds', async () => {
      try {
        await sendTransaction(wallet, address, amount);
      } catch (e) {
        expect(e.toString()).toMatch(/insufficient funds/);
      }
    });

    it('should throw if no wallet provided', async () => {
      try {
        await sendTransaction(undefined, address, amount);
      } catch (e) {
        expect(e).toEqual(new Error('Invalid wallet'));
      }
    });

    it('should throw if invalid address provided', async () => {
      try {
        await sendTransaction(wallet, 'invalid', amount);
      } catch (e) {
        expect(e).toEqual(new Error('Invalid address'));
      }
    });

    it('should throw if invalid amount provided', async () => {
      try {
        await sendTransaction(wallet, address, 'invalid');
      } catch (e) {
        expect(e).toEqual(new Error('Invalid amount'));
      }

      try {
        await sendTransaction(wallet, address, 1);
      } catch (e) {
        expect(e).toEqual(new Error('Invalid amount'));
      }

      try {
        await sendTransaction(wallet, address, '0');
      } catch (e) {
        expect(e).toEqual(new Error('Invalid amount'));
      }

      try {
        await sendTransaction(wallet, address, '-1');
      } catch (e) {
        expect(e).toEqual(new Error('Invalid amount'));
      }
    });
  });

  describe('#formatWeiToEther', () => {
    it('should format Wei the Ether', () => {
      expect(formatWeiToEther(1)).toBe('0.000000000000000001');
    });
  });

  describe('#getExploreTxUrl', () => {
    it('should get mainnet url', () => {
      expect(
        getExploreTxUrl(
          '0xbf558d3ea07c8639ddad7f6313dd6ae8c3c40518696e19701d407a93341e3326',
          ETH_NETWORKS.mainnet
        )
      ).toBe(
        'https://etherscan.io/tx/0xbf558d3ea07c8639ddad7f6313dd6ae8c3c40518696e19701d407a93341e3326'
      );
    });

    it('should get testnet url', () => {
      expect(
        getExploreTxUrl(
          '0xb4ea2e46d02cc46e793486b33157daa151b4b506ff265fc39c32ca6ee73bb0dd',
          ETH_NETWORKS.testnet
        )
      ).toBe(
        'https://rinkeby.etherscan.io/tx/0xb4ea2e46d02cc46e793486b33157daa151b4b506ff265fc39c32ca6ee73bb0dd'
      );
    });
  });
});
