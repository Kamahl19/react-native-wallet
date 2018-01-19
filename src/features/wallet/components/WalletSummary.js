import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { View, Text } from '../../../common/components';
import { satoshiToBitcoin, satoshiToUsd } from '../../../btcService';

const WalletSummary = ({ wallet, balance, price }) =>
  wallet ? (
    <View>
      <Text>Wallet Name: {wallet.walletName}</Text>
      <Text>Network: {wallet.network}</Text>
      {balance && (
        <View style={styles.balance}>
          <Text>Balance: {satoshiToBitcoin(balance.available)} BTC</Text>
          {price && <Text> (${satoshiToUsd(balance.available, price)})</Text>}
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
  balance: PropTypes.object,
  price: PropTypes.number,
};

export default WalletSummary;

const styles = StyleSheet.create({
  balance: {
    flexDirection: 'row',
  },
});
