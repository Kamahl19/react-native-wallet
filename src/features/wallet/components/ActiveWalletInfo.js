import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { View, Text } from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

const ActiveWalletInfo = ({ wallet, price }) =>
  wallet ? (
    <View>
      <Text>Wallet Name: {wallet.walletName}</Text>
      <Text>Network: {wallet.network}</Text>
      {wallet.balance && (
        <View style={styles.balance}>
          <Text>Balance: {formatAmount(wallet.balance.totalAmount)}</Text>
          {price && <Text> (${(wallet.balance.totalAmount / 1e8 * price).toFixed(2)})</Text>}
        </View>
      )}
    </View>
  ) : (
    <View>
      <Text>No Active Wallet</Text>
    </View>
  );

ActiveWalletInfo.propTypes = {
  wallet: PropTypes.object,
  price: PropTypes.number,
};

export default ActiveWalletInfo;

const styles = StyleSheet.create({
  balance: {
    flexDirection: 'row',
  },
});
