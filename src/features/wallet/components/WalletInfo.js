import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Text, ScreenWrapper, Heading, View } from '../../../common/components';
import { satoshiToBitcoin, satoshiToUsd } from '../../../unitsService';

const WalletInfo = ({ balance, price, wallet }) => (
  <ScreenWrapper>
    <Heading>Wallet Info</Heading>

    <View style={styles.cat}>
      <Text>Name: {wallet.walletName}</Text>
    </View>

    <View style={styles.cat}>
      <Text>ID: {wallet.walletId}</Text>
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

    {balance && (
      <View>
        <Heading notFirst>Balance</Heading>

        <View style={styles.cat}>
          <Text>
            Total: {satoshiToBitcoin(balance.total)} BTC{' '}
            {price && <Text>(${satoshiToUsd(balance.total, price)})</Text>}
          </Text>
          <Text style={styles.desc}>The total amount of btc.</Text>
        </View>

        <View style={styles.cat}>
          <Text>
            Available: {satoshiToBitcoin(balance.available)} BTC{' '}
            {price && <Text>(${satoshiToUsd(balance.available, price)})</Text>}
          </Text>
          <Text style={styles.desc}>The immediately spendable amount of btc.</Text>
        </View>

        <View style={styles.cat}>
          <Text>
            Confirming: {satoshiToBitcoin(balance.confirming)} BTC{' '}
            {price && <Text>(${satoshiToUsd(balance.confirming, price)})</Text>}
          </Text>
          <Text style={styles.desc}>
            The amount of btc with less than 1 blockchain confirmation.
          </Text>
        </View>

        <View style={styles.cat}>
          <Text>
            Locked: {satoshiToBitcoin(balance.locked)} BTC{' '}
            {price && <Text>(${satoshiToUsd(balance.locked, price)})</Text>}
          </Text>
          <Text style={styles.desc}>
            The amount of btc that is allocated as inputs to your pending transaction proposals.
          </Text>
        </View>
      </View>
    )}
  </ScreenWrapper>
);

WalletInfo.propTypes = {
  balance: PropTypes.object,
  wallet: PropTypes.object.isRequired,
  price: PropTypes.number,
};

export default WalletInfo;

const styles = StyleSheet.create({
  cat: {
    marginBottom: 12,
  },
  desc: {
    fontSize: 12,
  },
});
