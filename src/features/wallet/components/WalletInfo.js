import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Text, ScreenWrapper, Heading, View } from '../../../common/components';
import { satoshiToBitcoin } from '../../../btcService';

export default class WalletInfo extends Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    balance: PropTypes.object,
  };

  render() {
    const { wallet, balance } = this.props;

    return (
      <ScreenWrapper>
        <Heading>Wallet Info</Heading>

        {balance && (
          <View>
            <View style={styles.cat}>
              <Text>Total: {satoshiToBitcoin(balance.total)} BTC</Text>
              <Text style={styles.desc}>The total amount of btc.</Text>
            </View>

            <View style={styles.cat}>
              <Text>Available: {satoshiToBitcoin(balance.available)} BTC</Text>
              <Text style={styles.desc}>The immediately spendable amount of btc.</Text>
            </View>

            <View style={styles.cat}>
              <Text>Confirming: {satoshiToBitcoin(balance.confirming)} BTC</Text>
              <Text style={styles.desc}>
                The amount of btc with less than 1 blockchain confirmation.
              </Text>
            </View>

            <View style={styles.cat}>
              <Text>Locked: {satoshiToBitcoin(balance.locked)} BTC</Text>
              <Text style={styles.desc}>
                The amount of btc that is allocated as inputs to your pending transaction proposals.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.cat}>
          <Text>Wallet Name: {wallet.walletName}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Wallet ID: {wallet.walletId}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Coin: {wallet.coin}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Network: {wallet.network}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Address Type: {wallet.addressType}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Derivation Strategy: {wallet.derivationStrategy}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Extended Public Key: {wallet.xPubKey}</Text>
        </View>

        <View style={styles.cat}>
          <Text>Extended Private Key: {wallet.xPrivKey}</Text>
        </View>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  cat: {
    marginBottom: 12,
  },
  desc: {
    fontSize: 12,
  },
});
