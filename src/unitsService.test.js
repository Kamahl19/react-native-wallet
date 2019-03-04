import BigNumber from 'bignumber.js';

import {
  satoshiToBitcoin,
  bitcoinToSatoshi,
  bitcoinToUsd,
  satoshiToUsd,
  weiToUsd,
} from './unitsService';

const btcInUsd = 3000;

describe('unitsService.js', () => {
  describe('#satoshiToBitcoin', () => {
    it('should convert number Satoshi to Bitcoin', () => {
      expect(satoshiToBitcoin(1e8)).toEqual(BigNumber(1));
    });

    it('should convert string Satoshi to Bitcoin', () => {
      expect(satoshiToBitcoin('1e8')).toEqual(BigNumber(1));
    });

    it('should convert BigNumber Satoshi to Bitcoin', () => {
      expect(satoshiToBitcoin(BigNumber(1e8))).toEqual(BigNumber(1));
    });

    it('should convert to integer if satoshi is not an integer', () => {
      expect(satoshiToBitcoin(10000000.9)).toEqual(BigNumber(0.1));
    });

    it('should return zero if satoshi is NaN', () => {
      expect(satoshiToBitcoin('not-a-number')).toEqual(BigNumber(0));
    });
  });

  describe('#bitcoinToSatoshi', () => {
    it('should convert number Bitcoin to Satoshi', () => {
      expect(bitcoinToSatoshi(1)).toEqual(BigNumber(1e8));
    });

    it('should convert string Bitcoin to Satoshi', () => {
      expect(bitcoinToSatoshi('1')).toEqual(BigNumber(1e8));
    });

    it('should convert BigNumber Bitcoin to Satoshi', () => {
      expect(bitcoinToSatoshi(BigNumber(1))).toEqual(BigNumber(1e8));
    });

    it('should return zero if bitcoin is NaN', () => {
      expect(bitcoinToSatoshi('not-a-number')).toEqual(BigNumber(0));
    });
  });

  describe('#bitcoinToUsd', () => {
    const btc = 1.111111;
    const res = 3333.33;

    it('should convert number Bitcoin to USD', () => {
      expect(bitcoinToUsd(btc, btcInUsd)).toEqual(BigNumber(res));
    });

    it('should convert string Bitcoin to USD', () => {
      expect(bitcoinToUsd(`${btc}`, `${btcInUsd}`)).toEqual(BigNumber(res));
    });

    it('should convert BigNumber Bitcoin to USD', () => {
      expect(bitcoinToUsd(BigNumber(btc), BigNumber(btcInUsd))).toEqual(BigNumber(res));
    });

    it('should return zero if bitcoin is NaN', () => {
      expect(bitcoinToUsd('not-a-number', btcInUsd)).toEqual(BigNumber(0));
    });

    it('should return zero if btcInUsd is NaN', () => {
      expect(bitcoinToUsd(btc, 'not-a-number')).toEqual(BigNumber(0));
    });
  });

  describe('#satoshiToUsd', () => {
    it('should convert Satoshi to USD', () => {
      expect(satoshiToUsd(1e8, btcInUsd)).toEqual(BigNumber(btcInUsd));
    });
  });

  describe('#weiToUsd', () => {
    it('should convert Wei to USD', () => {
      expect(weiToUsd(1e14, 100)).toEqual('0.01');
    });
  });
});
