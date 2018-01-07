import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ScrollView, ScreenWrapper, Button, Heading, Text, View } from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

export default class WalletHistory extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
  };

  exploreTransaction = tx => {
    const { activeWallet } = this.props;

    Linking.openURL(
      `https://live.blockcypher.com/${
        activeWallet.network === 'testnet' ? 'btc-testnet' : 'btc'
      }/tx/${tx.txid}/`
    ).catch(err => console.error('An error occurred', err));
  };

  render() {
    const { activeWallet } = this.props;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Addresses</Heading>
          {activeWallet.addresses &&
            activeWallet.addresses.map(address => (
              <Text key={address.address}>{address.address}</Text>
            ))}

          <Heading notFirst>Transactions History</Heading>
          {activeWallet.txs &&
            activeWallet.txs.map(tx => (
              <View key={tx.txid} style={styles.transaction}>
                <Text>Type: {tx.action}</Text>
                <Text>Amount: {formatAmount(tx.amount)}</Text>
                <Text>Date: {moment(tx.time * 1000).format('MM/DD/YYYY')}</Text>
                <Text>Confirmations: {tx.confirmations || 0}</Text>
                <Text>Fee: {formatAmount(tx.fees)}</Text>
                {tx.message && <Text>Message: {tx.message}</Text>}
                <Button
                  onPress={() => this.exploreTransaction(tx)}
                  title="Explore Transaction"
                  type="default"
                  size="sm"
                  style={styles.button}
                />
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
  button: {
    marginTop: 12,
  },
});
