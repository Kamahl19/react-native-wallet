import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ScrollView, ScreenWrapper, Button, Heading, Text, View } from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

export default class WalletSettings extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    price: PropTypes.number,
    onCopy: PropTypes.func.isRequired,
  };

  render() {
    const { activeWallet, onCopy, price } = this.props;
    const { mnemonic, balance, addresses, coin, txs } = activeWallet;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Mnemonic</Heading>
          <Text>{mnemonic}</Text>

          <Button
            onPress={() => onCopy(mnemonic)}
            title="Copy to Clipboard"
            type="default"
            size="md"
            style={styles.copyButton}
          />

          <Heading notFirst>Balance</Heading>
          {balance && (
            <View style={styles.balance}>
              <Text>{formatAmount(balance.totalAmount, coin)}</Text>
              {price && <Text> (${(balance.totalAmount / 1e8 * price).toFixed(2)})</Text>}
            </View>
          )}

          <Heading notFirst>Addresses</Heading>
          {addresses &&
            addresses.map(address => <Text key={address.address}>{address.address}</Text>)}

          <Heading notFirst>Transactions History</Heading>
          {txs &&
            txs.map(tx => (
              <View key={tx.txid} style={styles.transaction}>
                <Text>Type: {tx.action}</Text>
                <Text>Amount: {formatAmount(tx.amount, coin)}</Text>
                <Text>Date: {moment(tx.time * 1000).format('MM/DD/YYYY')}</Text>
                <Text>Confirmations: {tx.confirmations || 0}</Text>
                <Text>Fee: {formatAmount(tx.fees, coin)}</Text>
                {tx.message && <Text>Message: {tx.message}</Text>}
              </View>
            ))}
        </ScreenWrapper>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  transaction: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  copyButton: {
    marginTop: 20,
  },
  balance: {
    flexDirection: 'row',
  },
});
