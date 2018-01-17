import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { View, Text } from '../../../common/components';
import { satoshiToBitcoin, satoshiToUsd, getWalletBalance } from '../../../btcService';

const WalletSummary = ({ wallet, price }) =>
  wallet ? (
    <View>
      <Text>Wallet Name: {wallet.walletName}</Text>
      <Text>Network: {wallet.network}</Text>
      {wallet.balance && (
        <View style={styles.balance}>
          <Text>Balance: {satoshiToBitcoin(getWalletBalance(wallet).available)} BTC</Text>
          {price && <Text> (${satoshiToUsd(getWalletBalance(wallet).available, price)})</Text>}
        </View>
      )}
    </View>
  ) : (
    <View>
      <Text>No Active Wallet</Text>
    </View>
  );

WalletSummary.propTypes = {
  wallet: PropTypes.object,
  price: PropTypes.number,
};

export default WalletSummary;

const styles = StyleSheet.create({
  balance: {
    flexDirection: 'row',
  },
});
