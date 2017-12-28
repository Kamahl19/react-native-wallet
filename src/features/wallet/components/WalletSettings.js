import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';

import { createForm } from '../../../common/services/Form';
import {
  ScrollView,
  ScreenWrapper,
  Button,
  Heading,
  Text,
  View,
  CenterView,
  FormItem,
  TextInput,
} from '../../../common/components';
import { formatAmount } from '../bitcoreUtils';
import CoinSelect from './CoinSelect';
import NetworkSelect from './NetworkSelect';
import { DEFAULT_COIN, DEFAULT_NETWORK } from '../constants';

@createForm()
export default class WalletSettings extends Component {
  static propTypes = {
    activeWallet: PropTypes.object.isRequired,
    price: PropTypes.number,
    onCopy: PropTypes.func.isRequired,
    exportWallet: PropTypes.func.isRequired,
    importWallet: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  };

  state = {
    importCoin: DEFAULT_COIN,
    importNetwork: DEFAULT_NETWORK,
  };

  importFromMnemonic = () => {
    const { form, importWallet } = this.props;
    const { importCoin, importNetwork } = this.state;

    form.validateFields((err, mnemonic) => {
      if (!err) {
        importWallet({
          mnemonic,
          coin: importCoin,
          network: importNetwork,
        });
      }
    });
  };

  render() {
    const { activeWallet, onCopy, price, exportWallet, form } = this.props;
    const { mnemonic, balance, addresses, coin, txs, exported } = activeWallet;
    const { importCoin, importNetwork } = this.state;

    // TODO import from QRCode

    return (
      <ScrollView>
        <ScreenWrapper>
          <Heading>Mnemonic</Heading>
          <TextInput label="Mnemonic" value={mnemonic} />

          <Button
            onPress={() => onCopy(mnemonic)}
            title="Copy to Clipboard"
            type="default"
            size="md"
            style={styles.button}
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

          <Heading notFirst>Export Wallet</Heading>

          <Button
            onPress={() => exportWallet()}
            title="Export Wallet"
            type="default"
            size="md"
            style={styles.button}
          />

          {exported && (
            <CenterView style={{ marginTop: 20 }}>
              <QRCode value={exported} />
            </CenterView>
          )}

          <Heading notFirst>Import Wallet from Mnemonic</Heading>
          <FormItem>{form.getFieldDecorator('mnemonic')(<TextInput label="Mnemonic" />)}</FormItem>
          <CoinSelect onChange={importCoin => this.setState({ importCoin })} value={importCoin} />
          <NetworkSelect
            onChange={importNetwork => this.setState({ importNetwork })}
            value={importNetwork}
          />
          <Button onPress={this.importFromMnemonic} title="Import" type="default" size="md" />
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
  balance: {
    flexDirection: 'row',
  },
});
