import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';

import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  Text,
  View,
  CenterView,
  TextInput,
} from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';

export default class WalletSettings extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    onCopy: PropTypes.func.isRequired,
    exportWallet: PropTypes.func.isRequired,
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
    const { activeWallet, onCopy, exportWallet } = this.props;
    const { mnemonic, addresses, txs, exported } = activeWallet;

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Addresses</Heading>
          {addresses &&
            addresses.map(address => <Text key={address.address}>{address.address}</Text>)}

          <Heading notFirst>Transactions History</Heading>
          {txs &&
            txs.map(tx => (
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
                  style={styles.exploreBtn}
                />
              </View>
            ))}

          <Heading notFirst>Mnemonic</Heading>
          <TextInput label="Mnemonic" value={mnemonic} />

          <Button
            onPress={() => onCopy(mnemonic)}
            title="Copy to Clipboard"
            type="default"
            size="md"
            style={styles.button}
          />

          <Heading notFirst>Export Wallet</Heading>

          <Button
            onPress={() => exportWallet()}
            title="Export Wallet"
            type="primary"
            size="md"
            style={styles.button}
          />

          {exported && (
            <CenterView style={{ marginTop: 20 }}>
              <QRCode value={exported} size={200} />
            </CenterView>
          )}
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
    marginTop: 20,
  },
  exploreBtn: {
    marginTop: 10,
  },
});
